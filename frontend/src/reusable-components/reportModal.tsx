import { useState } from "react";

interface ReportModalProps {
  onClose: () => void;
  onReport: (type: string) => void;
}

const reportTypes = [
  "Spam",
  "Harassment",
  "Inappropriate Content",
  "Fake Account",
  "Other",  
];

const ReportModal: React.FC<ReportModalProps> = ({ onClose, onReport }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Report User</h2>
        <p className="text-gray-600 mb-4">Select the reason for reporting this user:</p>
        <ul className="space-y-2">
          {reportTypes.map((type) => (
            <li key={type}>
              <button
                onClick={() => onReport(type)}
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition"
              >
                {type}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
