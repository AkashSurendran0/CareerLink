import React from 'react'

function CompanyPending({ handleDelete }: { handleDelete: () => void }) {
    return (
        <main className="min-h-dvh mt-10 bg-background text-foreground">
            <section className="mx-auto max-w-2xl px-4 py-12">
                <div className="rounded-xl bg-white border border-border bg-card/50 backdrop-blur p-6 md:p-8">
                    <div className="flex items-start gap-4">
                        <div
                            aria-hidden="true"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1.75a10.25 10.25 0 1 0 0 20.5 10.25 10.25 0 0 0 0-20.5Zm0 1.5a8.75 8.75 0 1 1 0 17.5 8.75 8.75 0 0 1 0-17.5Zm.75 4a.75.75 0 0 0-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 1 0 1.06-1.06l-2.78-2.78V7.25Z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-balance text-xl md:text-2xl font-semibold">Company Request Pending Approval</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Thanks for submitting your company for verification. Our team is reviewing your details. You’ll receive
                                an update via email and in-app notifications once a decision is made.
                            </p>
                            <div className="mt-6 grid gap-3 sm:flex sm:items-center">
                                <button
                                    onClick={handleDelete}
                                    className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                >
                                    Delete Request
                                </button>
                            </div>
                            <div className="mt-6 rounded-lg border border-dashed border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                                Tip: Need to update something? You can delete this request and submit a new one with the latest details.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CompanyPending
