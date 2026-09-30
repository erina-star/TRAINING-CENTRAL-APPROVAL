import { TrainingRegistration, DataSyncLink } from '../types';
import { parseCsvToRegistrations } from './googleLinkService';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  iconLink?: string;
}

/**
 * List spreadsheets and CSV files from user's Google Drive
 */
export async function listDriveSpreadsheetsAndCsvs(
  accessToken: string,
  searchQuery?: string
): Promise<{ files: DriveFile[]; error?: string }> {
  try {
    let q = "(mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'text/csv' or mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') and trashed = false";
    if (searchQuery && searchQuery.trim()) {
      const sanitized = searchQuery.replace(/'/g, "\\'");
      q += ` and name contains '${sanitized}'`;
    }

    const fields = 'files(id, name, mimeType, modifiedTime, size, webViewLink, iconLink)';
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      q
    )}&fields=${encodeURIComponent(fields)}&pageSize=50&orderBy=modifiedTime desc`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { files: [], error: 'Google Drive authorization expired. Please sign in again.' };
      }
      const errJson = await res.json().catch(() => ({}));
      return {
        files: [],
        error: errJson.error?.message || `Google Drive API error (HTTP ${res.status})`
      };
    }

    const data = await res.json();
    return { files: data.files || [] };
  } catch (err: any) {
    console.error('listDriveSpreadsheetsAndCsvs error:', err);
    return { files: [], error: err.message || 'Failed to list Google Drive files.' };
  }
}

/**
 * Reads and downloads data from a Google Drive spreadsheet or CSV file
 * Returns parsed TrainingRegistration rows strictly from the file
 */
export async function importRegistrationsFromDriveFile(
  file: DriveFile,
  accessToken: string,
  linkIndex: number = 0
): Promise<{ registrations: TrainingRegistration[]; syncLink: DataSyncLink; error?: string }> {
  try {
    let downloadUrl = '';
    if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
      // Export Google Sheet as CSV
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/csv`;
    } else {
      // Standard binary download for CSV / TSV
      downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
    }

    const res = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return {
        registrations: [],
        syncLink: {
          id: `DRIVE-${file.id}`,
          title: file.name,
          url: file.webViewLink || `https://drive.google.com/file/d/${file.id}`,
          type: 'google_sheet_csv',
          isActive: false,
          createdAt: new Date().toISOString()
        },
        error: `Could not download from Google Drive (HTTP ${res.status}): ${errText.slice(0, 100)}`
      };
    }

    const csvText = await res.text();
    const rows = parseCsvToRegistrations(
      csvText,
      'Platform Alpha',
      `Google Drive: ${file.name}`,
      file.webViewLink || `https://drive.google.com/file/d/${file.id}`,
      linkIndex
    );

    const syncLink: DataSyncLink = {
      id: `DRIVE-${file.id}`,
      title: file.name,
      url: file.webViewLink || `https://drive.google.com/file/d/${file.id}`,
      type: 'google_sheet_csv',
      targetPlatform: 'Platform Alpha',
      syncInterval: 'Drive Ingest',
      isActive: true,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordCount: rows.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { registrations: rows, syncLink };
  } catch (err: any) {
    console.error('importRegistrationsFromDriveFile error:', err);
    return {
      registrations: [],
      syncLink: {
        id: `DRIVE-${file.id}`,
        title: file.name,
        url: file.webViewLink || '',
        type: 'google_sheet_csv',
        isActive: false,
        createdAt: new Date().toISOString()
      },
      error: err.message || 'Error parsing Google Drive file.'
    };
  }
}

/**
 * Creates and saves a new CSV or Google Sheet file directly into the user's Google Drive.
 * Complies with user confirmation guidelines.
 */
export async function createSpreadsheetInDrive(
  fileName: string,
  csvContent: string,
  accessToken: string
): Promise<{ file?: DriveFile; error?: string }> {
  try {
    const metadata = {
      name: fileName.endsWith('.csv') ? fileName : `${fileName}.csv`,
      mimeType: 'text/csv'
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: text/csv\r\n\r\n' +
      csvContent +
      closeDelimiter;

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartRequestBody
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.error?.message || `Failed to create file in Drive (HTTP ${res.status})` };
    }

    const created = await res.json();
    return { file: created };
  } catch (err: any) {
    return { error: err.message || 'Failed to upload to Google Drive' };
  }
}

/**
 * Deletes a file from Google Drive.
 * MUST only be invoked after explicit confirmation per Workspace SKILL.md.
 */
export async function deleteFileFromDrive(
  fileId: string,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok && res.status !== 204) {
      return { success: false, error: `Delete failed (HTTP ${res.status})` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Delete operation failed' };
  }
}
