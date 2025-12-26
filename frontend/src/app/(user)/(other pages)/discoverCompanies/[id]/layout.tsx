"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/(user)/template";
import ReportModal from "@/reusable-components/reportModal";
import ConfirmModal from "@/reusable-components/confirmModal";

import {
    discoverCompanyInfo,
    reportCompany,
} from "@/services/userService";
import { enqueueSnackbar } from "notistack";

type Company = {
    id: string;
    logo: string;
    name: string;
    companySize: string;
    foundedYear: number;
    industry: string;
    websiteURL: string;
    location: string;
    aboutCompany: string;
    approved: boolean;
    rejected: boolean;
    suspended: boolean;
    rejectReasons: string[];
};

interface Props {
    params: {
        id: string
    }
}

export default async function CompanyLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const setLoading = useLoading();
    const router = useRouter();
    const [companyDetails, setCompanyDetails] = useState<Company>();
    const [activeTab, setActiveTab] = useState("About");
    const [reportModal, setReportModal] = useState(false)
    const [confirmModal, setConfirmModal] = useState(false)
    const [reportType, setReportType] = useState<string>()

    useEffect(() => {
        async function discoverCompanyDetails() {
            const result = await discoverCompanyInfo(id);
            setCompanyDetails(result.result);
        }

        discoverCompanyDetails();
    }, []);

    // const tabs = [
    //     "About",
    //     "Jobs Posted",
    //     "Photos / Media",
    // ];

    const tabs = [
        { text: "About", route: `/discoverCompanies/${id}` },
        { text: "Jobs Posted", route: `/discoverCompanies/${id}/jobsPosted` },
    ];

    const navigateTab = (tab: { text: string; route: string }) => {
        setLoading(true);
        setActiveTab(tab.text);
        router.push(tab.route);
    };

    const openConfirmModal = async (type: string) => {
        setReportType(type)
        setReportModal(false)
        setConfirmModal(true)
    }

    const report = async () => {
        if (!reportType) return
        setLoading(true)
        setConfirmModal(false)
        const result = await reportCompany(id, reportType)
        setLoading(false)
        if (result.result.success) {
            enqueueSnackbar('Report has been submitted', { variant: 'success' })
        } else {
            enqueueSnackbar('A previous report is pending with the same company, please try again after some time', { variant: 'error' })
        }
    }

    return (
        <>
            {companyDetails && (
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Company Header Card */}
                        {reportModal && (
                            <ReportModal onClose={() => setReportModal(false)} onReport={openConfirmModal} />
                        )}
                        {confirmModal && (
                            <ConfirmModal onClose={() => setConfirmModal(false)} title="Confirm your action!" message="Do you want to report this company?" onConfirm={report} />
                        )}
                        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                {/* Left: Logo + Basic Info */}
                                <div className="flex items-start gap-4">
                                    <div className="h-16 w-24 sm:h-24 sm:w-24 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                                        {companyDetails && companyDetails.logo ? (
                                            <Image
                                                width={300}
                                                height={300}
                                                src={`${companyDetails?.logo}`}
                                                alt="Sophia Carter"
                                                className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl sm:text-2xl font-semibold text-gray-600">
                                                CO
                                            </span>
                                        )}
                                    </div>
                                    <div className="px-4 py-2">
                                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                            {companyDetails && companyDetails.name}
                                        </h1>
                                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-blue-600">
                                            <span className="text-gray-500">
                                                {companyDetails && companyDetails.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-start lg:justify-end">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md cursor-pointer mt-1"
                                        onClick={() => setReportModal(true)}
                                    >
                                        Report
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="mt-6">
                                <div className="flex items-center gap-4 text-sm">
                                    <nav className="flex space-x-8 px-6">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.text}
                                                onClick={() => navigateTab(tab)}
                                                className={`py-4 px-1 cursor-pointer border-b-2 font-medium text-sm ${activeTab === tab.text
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    }`}
                                            >
                                                {tab.text}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </section>

                        <>{children}</>
                    </div>
                </main>
            )}
        </>
    );
}
