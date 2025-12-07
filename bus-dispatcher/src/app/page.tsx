import LandingPageContent from '@/components/features/landing/LandingPageContent';
import Sidebar from '@/components/layout/Sidebar';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <LandingPageContent />

      {/* Sidebar */}
      <div className="hidden lg:block w-80">
        <Sidebar />
      </div>
    </div>
  );
}
