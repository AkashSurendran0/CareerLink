
interface ReportModalProps {
  onClose: () => void;
  onReport: (type: string) => void;
  title?:string;
  message?:string
}

const reportTypes = [
  "Spam",
  "Harassment",
  "Inappropriate Content",
  "Impersonation",
  "Fake Account",
  "Misinformation",
  "Privacy Violation",
  "Illegal Activity",
  "Hate speech",
  "Fraud attempt"
];

const ReportModal: React.FC<ReportModalProps> = ({ 
  onClose, 
  onReport, 
  title = "Report User", 
  message = "Select the reason for reporting this user:"
}) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
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
