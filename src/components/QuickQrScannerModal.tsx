import React, { useState } from 'react';
import { QrCode, Search, X, Check, Eye, UserCheck, HeartHandshake } from 'lucide-react';
import { Constituent, AssistanceRequest } from '../types';
import { formatPeso, formatDate } from '../utils/formatters';

interface QuickQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  constituents: Constituent[];
  assistanceRequests: AssistanceRequest[];
}

export const QuickQrScannerModal: React.FC<QuickQrScannerModalProps> = ({
  isOpen,
  onClose,
  constituents,
  assistanceRequests,
}) => {
  const [scannedInput, setScannedInput] = useState('');
  const [matchedConstituent, setMatchedConstituent] = useState<Constituent | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = (person: Constituent) => {
    setMatchedConstituent(person);
    setScannedInput(person.qrCodeData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
            <QrCode className="w-5 h-5 text-sky-500" />
            <span>Scan Municipal Constituent QR Code</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!matchedConstituent ? (
          <div className="space-y-4 text-xs">
            <div className="p-6 bg-slate-900 text-white rounded-2xl text-center space-y-3 border border-slate-800">
              <div className="w-16 h-16 mx-auto bg-blue-500/10 border-2 border-dashed border-sky-400 rounded-2xl flex items-center justify-center">
                <QrCode className="w-8 h-8 text-sky-400 animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Align QR Code within Scanner Frame</h4>
                <p className="text-slate-400 text-[11px]">Place the constituent's OSCA, PWD, or Solo Parent QR ID in front of the camera.</p>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">Or select a registered citizen to simulate scan:</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {constituents.map((person) => (
                  <button
                    key={person.id}
                    onClick={() => handleSimulateScan(person)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-xl border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{person.fullName}</span>
                      <span className="text-[10px] text-slate-500">{person.id} &bull; Brgy. {person.barangay} [{person.sector}]</span>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">Scan</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 text-sm block">QR Code Verified!</span>
                <span className="text-emerald-700 dark:text-emerald-300 text-[11px] font-mono">{matchedConstituent.qrCodeData}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-base">{matchedConstituent.fullName}</div>
              <div className="text-slate-600 dark:text-slate-300">
                Sector: <strong className="text-blue-600">{matchedConstituent.sector}</strong> &bull; Sector ID: <strong className="font-mono">{matchedConstituent.idNumber}</strong>
              </div>
              <div className="text-slate-600 dark:text-slate-300">Address: Brgy. {matchedConstituent.barangay}, {matchedConstituent.address}</div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">AICS Aid History ({assistanceRequests.filter(a => a.constituentId === matchedConstituent.id).length}):</h5>
              <div className="space-y-1.5">
                {assistanceRequests.filter(a => a.constituentId === matchedConstituent.id).map(a => (
                  <div key={a.id} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between items-center text-[11px]">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{a.assistanceType}</span>
                      <span className="text-slate-500 block">{formatDate(a.dateRequested)}</span>
                    </div>
                    <span className="font-bold text-emerald-600">{formatPeso(a.disbursedAmount || a.recommendedAmount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setMatchedConstituent(null)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
              >
                Scan Another
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
