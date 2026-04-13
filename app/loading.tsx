export default function Loading() {
  return (
    <div className="space-y-10 mt-8 p-4 md:p-8 animate-pulse">
      <div className="h-72 border-[3px] border-black bg-gray-100" />
      <div className="space-y-4">
        <div className="h-8 w-64 bg-gray-200 border-2 border-black" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-72 border-[3px] border-black bg-gray-100" />
          <div className="h-72 border-[3px] border-black bg-gray-100" />
          <div className="h-72 border-[3px] border-black bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
