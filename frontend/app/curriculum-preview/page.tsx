import dynamic from "next/dynamic";

// Load the full curriculum preview component client-side only.
// This prevents React hydration errors (#418, #423) caused by
// localStorage-driven state that differs between SSR and client renders.
const CurriculumPreviewClient = dynamic(
    () => import("./CurriculumPreviewClient"),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="space-y-4 w-full max-w-2xl px-6 animate-pulse">
                    <div className="h-8 rounded-lg bg-slate-900/60 border border-white/5 w-1/3" />
                    <div className="h-48 rounded-xl bg-slate-900/60 border border-white/5" />
                    <div className="h-24 rounded-xl bg-slate-900/60 border border-white/5" />
                    <div className="h-12 rounded-xl bg-slate-900/60 border border-white/5 w-1/2" />
                </div>
            </div>
        ),
    }
);

export default function CurriculumPreviewPage() {
    return <CurriculumPreviewClient />;
}
