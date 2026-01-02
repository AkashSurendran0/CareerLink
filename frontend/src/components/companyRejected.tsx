import React from 'react'

function CompanyRejected({ handleReapply, handleEdit, handleDelete, reasons }: { handleReapply: () => void, handleEdit: () => void, handleDelete: () => void, reasons: string[] }) {
    return (
        <main className="min-h-dvh bg-background text-foreground">
            <section className="mx-auto max-w-3xl px-4 py-12">
                <div
                    className="rounded-xl bg-white border border-border bg-card/50 backdrop-blur p-6 md:p-8"
                    role="alert"
                    aria-live="polite"
                >
                    <div className="flex items-start gap-4">
                        {/* Rejected icon */}
                        <div
                            aria-hidden="true"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Zm3.53 6.97a.75.75 0 0 1 0 1.06L13.06 12l2.47 2.47a.75.75 0 1 1-1.06 1.06L12 13.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L10.94 12 8.47 9.53A.75.75 0 0 1 9.53 8.47L12 10.94l2.47-2.47a.75.75 0 0 1 1.06 0Z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-balance text-xl md:text-2xl font-semibold">Company Request Rejected</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Your submission didn&apos;t meet our verification criteria. Please make the required
                                changes, and reapply.
                            </p>
                            <div className="mt-6 rounded-lg border border-red-200 bg-red-50/60 p-4 text-sm">
                                <div className="font-medium text-red-700">Reason provided by admin</div>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-red-700/90">
                                    {reasons?.map((reason: string, idx: number) => (
                                        <li key={idx}>{reason}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-6 grid gap-3 sm:flex sm:items-center">
                                <button
                                    onClick={handleReapply}
                                    className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                >
                                    Reapply
                                </button>
                                <button
                                    onClick={handleEdit}
                                    className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    Edit Changes
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="text-white cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    Delete Request
                                </button>
                            </div>
                            <p className="mt-4 text-xs text-muted-foreground">
                                Note: Reapplying will create a new request for our reviewers. Editing allows you to update the previous
                                submission before resubmitting.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CompanyRejected
