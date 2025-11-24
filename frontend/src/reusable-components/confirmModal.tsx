"use client";

interface ModalProps {
  onClose: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export default function ConfirmModal({
  onClose,
  title,
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-sm p-6 animate-fadeIn">

            <h2 className="text-lg font-semibold">{title}</h2>

            {message && <p className="text-gray-600 mt-2 text-sm">{message}</p>}

            <div className="flex justify-end gap-3 mt-6">
            <button
                onClick={onClose}
                className="cursor-pointer px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
                {cancelText}
            </button>

            <button
                onClick={onConfirm}
                className="cursor-pointer px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
                {confirmText}
            </button>
            </div>

        </div>
        </div>
    );
}
