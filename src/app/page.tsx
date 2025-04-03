import Header from "@/components/header";
import ClaimSection from "@/components/claim-section";
import TimelineSection from "@/components/timeline-section";
import HelpSection from "@/components/help-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="hyperlane-container py-6 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <ClaimSection />
        </div>
        <div className="w-full lg:w-1/3 space-y-6">
          <TimelineSection />
          <HelpSection />
        </div>
      </div>
    </main>
  );
}
