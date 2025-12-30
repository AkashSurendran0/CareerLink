type ResumeViewerProps = {
  resumeUrl: string,
  onClose: () => void
}

const ResumeViewer = ({ resumeUrl, onClose }: ResumeViewerProps) => {
    if (!resumeUrl) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] h-[90%] rounded-xl relative">
                <button
                    className="absolute top-3 right-4 text-xl font-bold"
                    onClick={onClose}
                >
                    ✕
                </button>

                <iframe
                    src={resumeUrl}
                    title="Applicant Resume"
                    className="w-full h-full rounded-xl"
                />
            </div>
        </div>
    )
}

export default ResumeViewer
