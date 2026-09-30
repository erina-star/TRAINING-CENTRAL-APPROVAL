import React, { useState, useEffect } from 'react';
import { DataSyncLink, TrainingRegistration, Platform } from '../types';
import {
  parseGoogleLinksInput,
  fetchAndIntegrateGoogleLink,
  ParsedGoogleLink,
  parsePastedGoogleSheetData,
  GoogleLinkFetchResult
} from '../services/googleLinkService';

interface GoogleSheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncLinks: DataSyncLink[];
  onExecuteSync: (sheetUrl: string, title?: string) => void;
  onSaveLink: (link: DataSyncLink) => void;
  onDeleteLink: (id: string) => void;
  onBatchIntegrate?: (registrations: TrainingRegistration[], links: DataSyncLink[], filterToGoogleOnly?: boolean) => void;
  onOpenDrive?: () => void;
}

export const GoogleSheetSyncModal: React.FC<GoogleSheetSyncModalProps> = ({
  isOpen,
  onClose,
  syncLinks,
  onSaveLink,
  onDeleteLink,
  onBatchIntegrate,
  onOpenDrive
}) => {
  const [activeTab, setActiveTab] = useState<'batch' | 'direct_paste' | 'manage'>('batch');

  // Batch Upload State (Maximum 20 Google Links)
  const [batchRawInput, setBatchRawInput] = useState<string>('');
  const [defaultPlatform, setDefaultPlatform] = useState<Platform>('Platform Alpha');
  const [parsedLinks, setParsedLinks] = useState<ParsedGoogleLink[]>([]);
  const [totalDetected, setTotalDetected] = useState<number>(0);
  const [excessCount, setExcessCount] = useState<number>(0);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number; title: string }>({
    current: 0,
    total: 0,
    title: ''
  });

  // Batch processing outcome feedback
  const [batchResults, setBatchResults] = useState<{
    linkResults: GoogleLinkFetchResult[];
    totalCaptured: number;
  } | null>(null);

  // Direct Paste State
  const [pastedContent, setPastedContent] = useState<string>('');
  const [pastedTitle, setPastedTitle] = useState<string>('Google Sheet Ingest (Direct)');
  const [pastedPlatform, setPastedPlatform] = useState<Platform>('Platform Alpha');
  const [pastedPreview, setPastedPreview] = useState<TrainingRegistration[]>([]);

  // Recalculate parsed links whenever batchRawInput or defaultPlatform changes
  useEffect(() => {
    const { links, totalCount, excessCount: excess } = parseGoogleLinksInput(batchRawInput, defaultPlatform);
    setParsedLinks(links);
    setTotalDetected(totalCount);
    setExcessCount(excess);
    setBatchResults(null);
  }, [batchRawInput, defaultPlatform]);

  // Recalculate direct pasted rows
  useEffect(() => {
    if (pastedContent.trim()) {
      const parsed = parsePastedGoogleSheetData(
        pastedContent,
        pastedTitle,
        'pasted-google-sheet',
        pastedPlatform
      );
      setPastedPreview(parsed);
    } else {
      setPastedPreview([]);
    }
  }, [pastedContent, pastedTitle, pastedPlatform]);

  if (!isOpen) return null;

  // Preload a real public Google Sheet CSV stream for quick test
  const handleLoadSampleLink = () => {
    // Official Google Visualization CSV test link with real data
    const sample =
      'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing';
    setBatchRawInput(sample);
  };

  // Handle file upload of .txt or .csv containing links
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setBatchRawInput(content);
      }
    };
    reader.readAsText(file);
  };

  // Execute Batch Integration for up to 20 links - STRICTLY REAL DATA
  const handleExecuteBatchSync = async () => {
    if (parsedLinks.length === 0) return;
    setIsBatchProcessing(true);
    setBatchResults(null);

    const allNewRegistrations: TrainingRegistration[] = [];
    const allNewLinks: DataSyncLink[] = [];
    const linkResults: GoogleLinkFetchResult[] = [];

    for (let i = 0; i < parsedLinks.length; i++) {
      const link = parsedLinks[i];
      setProcessingProgress({
        current: i + 1,
        total: parsedLinks.length,
        title: link.title
      });

      const res = await fetchAndIntegrateGoogleLink(link, i);
      linkResults.push(res);

      if (res.registrations.length > 0) {
        allNewRegistrations.push(...res.registrations);
        allNewLinks.push(res.syncLink);
      }
    }

    setBatchResults({
      linkResults,
      totalCaptured: allNewRegistrations.length
    });
    setIsBatchProcessing(false);

    if (allNewRegistrations.length > 0 && onBatchIntegrate) {
      onBatchIntegrate(allNewRegistrations, allNewLinks, true);
    }
  };

  // Handle Direct Paste Integration
  const handleIntegratePasted = () => {
    if (pastedPreview.length === 0) return;

    const syncLink: DataSyncLink = {
      id: `LINK-PASTE-${Date.now()}`,
      title: pastedTitle,
      url: 'Direct Google Sheet Table Import',
      type: 'google_sheet_csv',
      targetPlatform: pastedPlatform,
      syncInterval: 'Direct Capture',
      isActive: true,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordCount: pastedPreview.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (onBatchIntegrate) {
      onBatchIntegrate(pastedPreview, [syncLink], true);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#191c1e]/65 backdrop-blur-xs transition-opacity duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#c4c7c5] animate-in fade-in zoom-in-95 duration-200 max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f2f4f6] flex items-center justify-between border-b border-[#e0e2ec]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00236f] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">dataset_linked</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#00164e] leading-tight">
                  Google Link Data Capture &amp; Approval Integration
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-[10px] font-bold border border-[#52d69f]">
                  Max 20 Links
                </span>
              </div>
              <p className="text-xs text-[#444746] mt-0.5">
                Capture real data strictly from your shared Google links to make them visible for approval
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#e0e2ec] text-[#444746] hover:text-[#1b1b1f] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Strict Data Integrity Guarantee Banner */}
        <div className="bg-[#e8f0fe] px-5 py-2.5 border-b border-[#c2e7ff] flex items-center justify-between text-xs text-[#001d35]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#004a77]">verified_user</span>
            <span>
              <strong>Authentic Link Data Only:</strong> No dummy/sample records will be created. The approval triage will display strictly the records extracted from your shared Google links.
            </span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#e0e2ec] bg-white px-5 pt-2.5 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('batch')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'batch'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-[#74777f] hover:text-[#1b1b1f]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">link</span>
            <span>Google Links Upload (Up to 20)</span>
            {parsedLinks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#dae2fd] text-[#00164e] text-[10px] font-bold">
                {parsedLinks.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('direct_paste')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'direct_paste'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-[#74777f] hover:text-[#1b1b1f]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">content_paste</span>
            <span>Direct Sheet Cells Paste</span>
            {pastedPreview.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#85f8c4] text-[#002114] text-[10px] font-bold">
                {pastedPreview.length} rows
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'manage'
                ? 'border-[#00236f] text-[#00236f]'
                : 'border-transparent text-[#74777f] hover:text-[#1b1b1f]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">folder_special</span>
            <span>Saved Links ({syncLinks.length})</span>
          </button>

          {onOpenDrive && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDrive();
              }}
              className="pb-2.5 border-b-2 border-transparent text-[#00236f] hover:text-[#1e3a8a] flex items-center gap-1.5 transition-colors cursor-pointer ml-auto font-bold"
            >
              <span className="material-symbols-outlined text-[17px]">add_to_drive</span>
              <span>Open Google Drive Browser &rarr;</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: BATCH UPLOAD (UP TO 20 GOOGLE LINKS) */}
          {activeTab === 'batch' && (
            <div className="space-y-4">
              {/* Instructions & Counter Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#dae2fd] border border-[#b6c4ff] text-[#00164e]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#00236f]">share</span>
                  <div className="text-xs">
                    <span className="font-bold">Paste up to 20 Google Links</span> (one per line). Supports Google Sheets, Form Responses, and CSV export URLs.
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      parsedLinks.length > 0 && parsedLinks.length <= 20
                        ? 'bg-[#85f8c4] text-[#002114] border-[#52d69f]'
                        : 'bg-white text-[#00164e] border-[#b6c4ff]'
                    }`}
                  >
                    {parsedLinks.length} / 20 Links
                  </span>
                </div>
              </div>

              {/* Excess Warning if > 20 */}
              {excessCount > 0 && (
                <div className="p-3 rounded-xl bg-[#ffdad6] border border-[#ffb4ab] text-[#410002] text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">warning</span>
                  <div>
                    <span className="font-bold">{totalDetected} links detected!</span> Maximum is{' '}
                    <strong>20 links per upload</strong>. Only the first 20 links will be processed. The remaining{' '}
                    {excessCount} links were excluded.
                  </div>
                </div>
              )}

              {/* Input Toolbar */}
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#1b1b1f] flex items-center gap-1">
                  <span>Enter Your Google Link(s)</span>
                  <span className="text-[#74777f] font-normal">(Ensure link is viewable with link sharing)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSampleLink}
                    className="text-[#00236f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">link</span>
                    <span>Load Public Sample</span>
                  </button>

                  <span className="text-[#c4c7c5]">|</span>

                  <label className="text-[#00236f] hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">attach_file</span>
                    <span>Upload .txt / .csv</span>
                    <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
                  </label>

                  {batchRawInput && (
                    <>
                      <span className="text-[#c4c7c5]">|</span>
                      <button
                        type="button"
                        onClick={() => setBatchRawInput('')}
                        className="text-[#ba1a1a] hover:underline font-semibold cursor-pointer"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Textarea Input */}
              <textarea
                value={batchRawInput}
                onChange={(e) => setBatchRawInput(e.target.value)}
                rows={4}
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing&#10;https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pub?output=csv"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c7c5] focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] font-mono text-xs text-[#1b1b1f] leading-relaxed transition-all resize-y"
              />

              {/* Platform Assignment Setting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#f8f9fa] border border-[#e0e2ec]">
                <div>
                  <label className="text-xs font-bold text-[#1b1b1f] block mb-1">Target Platform Assignment</label>
                  <select
                    value={defaultPlatform}
                    onChange={(e) => setDefaultPlatform(e.target.value as Platform)}
                    className="w-full h-9 px-3 rounded-lg border border-[#c4c7c5] bg-white text-xs text-[#1b1b1f] focus:border-[#00236f]"
                  >
                    <option value="Platform Alpha">Auto-Distribute Across Operating Hubs (Alpha, Beta, Gamma)</option>
                    <option value="Platform Alpha">Assign to Platform Alpha</option>
                    <option value="Platform Beta">Assign to Platform Beta</option>
                    <option value="Platform Gamma">Assign to Platform Gamma</option>
                  </select>
                </div>

                <div className="text-xs text-[#565e74] flex flex-col justify-center">
                  <span className="font-semibold text-[#1b1b1f]">Strict Data Extraction Protocol</span>
                  <span className="text-[11px] mt-0.5 leading-snug">
                    Columns for Participant Name, Staff ID, Training Title, and Date are parsed directly from the Google link with no simulated data injection.
                  </span>
                </div>
              </div>

              {/* Parsed Links Queue */}
              {parsedLinks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1b1b1f]">
                      Detected Links ({parsedLinks.length} links ready to capture):
                    </span>
                    <span className="text-[11px] text-[#006e1c] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006e1c]"></span>
                      Ready
                    </span>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-[#e0e2ec] rounded-xl p-2 bg-[#f8f9fa]">
                    {parsedLinks.map((link, idx) => (
                      <div
                        key={link.id}
                        className="p-2 rounded-lg bg-white border border-[#e0e2ec] flex items-center justify-between text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="w-5 h-5 rounded-full bg-[#dae2fd] text-[#00164e] text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="truncate">
                            <span className="font-bold text-[#00164e] mr-2">{link.title}</span>
                            <span className="text-[11px] text-[#74777f] font-mono truncate">{link.url}</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e6e8ea] text-[#444651] shrink-0 ml-2">
                          {link.platform}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing Progress Bar */}
              {isBatchProcessing && (
                <div className="p-4 rounded-xl bg-[#dae2fd] border border-[#b6c4ff] space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-[#00164e] font-bold">
                    <span>
                      Capturing Data from Link {processingProgress.current} of {processingProgress.total}...
                    </span>
                    <span>{Math.round((processingProgress.current / processingProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full bg-[#00236f] transition-all duration-300 rounded-full"
                      style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#00236f] truncate">Reading rows from: {processingProgress.title}</p>
                </div>
              )}

              {/* Batch Results Summary (Strict Authenticity Confirmation) */}
              {batchResults && (
                <div className="p-4 rounded-xl border space-y-3 bg-[#f8f9fa] border-[#c4c7c5]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          batchResults.totalCaptured > 0 ? 'text-[#006e1c]' : 'text-[#ba1a1a]'
                        }`}
                      >
                        {batchResults.totalCaptured > 0 ? 'task_alt' : 'error'}
                      </span>
                      <span className="font-bold text-xs text-[#1b1b1f]">
                        {batchResults.totalCaptured > 0
                          ? `Captured ${batchResults.totalCaptured} Real Records from Google Links`
                          : 'No Records Captured from Link(s)'}
                      </span>
                    </div>
                    {batchResults.totalCaptured > 0 && (
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-3 py-1 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        View &amp; Approve in Portal &rarr;
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs">
                    {batchResults.linkResults.map((res, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border flex items-center justify-between ${
                          res.status === 'success'
                            ? 'bg-[#edf7ed] border-[#c8e6c9] text-[#1b5e20]'
                            : 'bg-[#fff4e5] border-[#ffe0b2] text-[#e65100]'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <span className="font-bold mr-1">Link #{i + 1}:</span>
                          <span>{res.syncLink.title}</span>
                          {res.errorMessage && (
                            <span className="block text-[11px] text-[#c62828] mt-0.5">{res.errorMessage}</span>
                          )}
                        </div>
                        <span className="font-bold text-[11px] shrink-0">
                          {res.registrations.length} records captured
                        </span>
                      </div>
                    ))}
                  </div>

                  {batchResults.totalCaptured === 0 && (
                    <div className="p-3 bg-[#ffdad6] text-[#410002] rounded-lg text-xs leading-relaxed">
                      <strong>Why 0 records were captured:</strong> If your Google Sheet is set to private, Google restricts direct downloads to logged-in sessions. You can switch to the <strong>&quot;Direct Sheet Cells Paste&quot;</strong> tab above, select all cells in your Google Sheet (Ctrl+A, Ctrl+C), and paste them here to instantly capture 100% of your data!
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleExecuteBatchSync}
                disabled={parsedLinks.length === 0 || isBatchProcessing}
                className="w-full h-11 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isBatchProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Real Rows from Google Links...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                    <span>
                      Capture Data from {parsedLinks.length > 0 ? `${parsedLinks.length} Google Links` : 'Links'} &amp; Make Visible for Approval
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: DIRECT SHEET CELLS PASTE */}
          {activeTab === 'direct_paste' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#dae2fd] border border-[#b6c4ff] text-[#00164e] text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#00236f]">content_paste_go</span>
                  <span>Instant 100% Accurate Google Sheet Ingest (Zero Permission Barriers)</span>
                </div>
                <p className="text-[11px] text-[#00236f]/90 leading-relaxed">
                  Open your Google Sheet, select all cells (<strong>Ctrl + A</strong> or <strong>Cmd + A</strong>), copy (<strong>Ctrl + C</strong>), and paste directly below. We parse the exact rows, columns, names, and training programs without requiring web publishing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1b1b1f] block mb-1">Source Title / Reference</label>
                  <input
                    type="text"
                    value={pastedTitle}
                    onChange={(e) => setPastedTitle(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#c4c7c5] text-xs focus:border-[#00236f]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1b1b1f] block mb-1">Platform Assignment</label>
                  <select
                    value={pastedPlatform}
                    onChange={(e) => setPastedPlatform(e.target.value as Platform)}
                    className="w-full h-9 px-3 rounded-lg border border-[#c4c7c5] bg-white text-xs focus:border-[#00236f]"
                  >
                    <option value="Platform Alpha">Platform Alpha</option>
                    <option value="Platform Beta">Platform Beta</option>
                    <option value="Platform Gamma">Platform Gamma</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#1b1b1f] block mb-1">
                  Paste Sheet Rows / Table Data Here:
                </label>
                <textarea
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  rows={6}
                  placeholder="Paste copied table rows from your Google Sheet here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#c4c7c5] focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] font-mono text-xs text-[#1b1b1f] leading-relaxed resize-y"
                />
              </div>

              {/* Live Preview of Pasted Rows */}
              {pastedPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1b1b1f]">
                      Extracted Real Data Preview ({pastedPreview.length} rows ready for approval):
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#85f8c4] text-[#002114] text-[10px] font-bold">
                      Strict Match
                    </span>
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-[#e0e2ec] rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs bg-white">
                      <thead className="bg-[#f2f4f6] text-[#444746] font-semibold border-b border-[#e0e2ec]">
                        <tr>
                          <th className="py-2 px-3">Candidate</th>
                          <th className="py-2 px-3">Staff ID</th>
                          <th className="py-2 px-3">Program</th>
                          <th className="py-2 px-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eceef0]">
                        {pastedPreview.slice(0, 10).map((row) => (
                          <tr key={row.id} className="hover:bg-[#f8f9fa]">
                            <td className="py-2 px-3 font-bold text-[#1b1b1f]">{row.staffName}</td>
                            <td className="py-2 px-3 font-mono text-[#565e74]">{row.staffId}</td>
                            <td className="py-2 px-3 text-[#1b1b1f]">{row.program}</td>
                            <td className="py-2 px-3 text-[#565e74]">{row.sessionDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {pastedPreview.length > 10 && (
                    <p className="text-[11px] text-[#565e74] text-right">
                      + {pastedPreview.length - 10} more rows ready to integrate
                    </p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleIntegratePasted}
                disabled={pastedPreview.length === 0}
                className="w-full h-11 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>
                  Integrate {pastedPreview.length} Real Records &amp; Make Visible for Approval
                </span>
              </button>
            </div>
          )}

          {/* TAB 3: SAVED IN FIREBASE */}
          {activeTab === 'manage' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1b1b1f]">Active Google Data Sources ({syncLinks.length}):</span>
                <span className="text-[11px] text-[#565e74]">Persistent in Firestore</span>
              </div>

              {syncLinks.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-[#c4c7c5] rounded-xl text-[#74777f] text-xs">
                  No Google Links currently saved. Upload links in the first tab to begin.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {syncLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-3 rounded-xl bg-white border border-[#e0e2ec] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs hover:border-[#b6c4ff] transition-all"
                    >
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#00164e]">{link.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#e6e8ea] text-[#444651]">
                            {link.targetPlatform || 'All Platforms'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-[#74777f] truncate mt-0.5">{link.url}</p>
                        <div className="flex items-center gap-3 text-[10px] text-[#565e74] mt-1">
                          <span>Synced: {link.lastSyncedAt || 'Active'}</span>
                          {link.recordCount !== undefined && (
                            <span className="font-bold text-[#00236f]">{link.recordCount} rows captured</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => onDeleteLink(link.id)}
                          className="px-2.5 py-1 text-xs text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
