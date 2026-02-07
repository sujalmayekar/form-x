import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import FormModel from "@/models/Form";
import ResponseModel from "@/models/Response";
import AnalyticsView from "@/components/AnalyticsView";
import Navbar from "@/components/Navbar";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PublicAnalyticsPage({ params }: PageProps) {
    const { id } = await params;

    await dbConnect();

    try {
        const formDoc = await FormModel.findById(id).lean();
        if (!formDoc) {
            return notFound();
        }

        const responsesDocs = await ResponseModel.find({ formId: id })
            .sort({ submittedAt: -1 })
            .lean();

        // Serialize data for client component
        const form = JSON.parse(JSON.stringify(formDoc));
        const responses = JSON.parse(JSON.stringify(responsesDocs));

        return (
            <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans">
                <Navbar />
                <div className="fixed inset-0 pointer-events-none z-0 technical-grid" />

                <div className="relative z-10 max-w-7xl mx-auto pt-28 px-6 pb-16 space-y-8">
                    {/* Header */}
                    <div className="bg-zinc-900/40 border border-white/5 rounded-lg p-6 md:p-7 backdrop-blur-xl flex flex-col md:flex-row md:items-center md:gap-6 gap-4 animate-fade-in">
                        <div className="flex-1 space-y-1">
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-zinc-800/50 border border-zinc-700 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                                Public Analytics
                            </div>
                            <h1 className="text-2xl md:text-3xl font-serif tracking-tight text-white">
                                {form.title}
                            </h1>
                            {form.description && (
                                <p className="text-zinc-400 mt-1 max-w-2xl">{form.description}</p>
                            )}
                        </div>
                    </div>

                    <AnalyticsView form={form} responses={responses} isPublic={true} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-500">
                Something went wrong.
            </div>
        );
    }
}
