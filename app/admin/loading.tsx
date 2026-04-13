export default function AdminLoading() {
  return (
    <div className="space-y-8 mt-8 p-4 md:p-8 animate-pulse">
      <div className="h-40 border-[3px] border-black bg-gray-100" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="h-32 border-[3px] border-black bg-gray-100" />
        <div className="h-32 border-[3px] border-black bg-gray-100" />
        <div className="h-32 border-[3px] border-black bg-gray-100" />
        <div className="h-32 border-[3px] border-black bg-gray-100" />
      </div>
      <div className="h-80 border-[3px] border-black bg-gray-100" />
    </div>
  );
}
