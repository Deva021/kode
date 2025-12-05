export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Bus Schedules</h1>
        
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200 shadow-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading schedules...</p>
        </div>
      </div>
    </div>
  );
}
