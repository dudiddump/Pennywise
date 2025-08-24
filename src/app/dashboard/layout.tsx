import Navbar from "@/components/Navbar"; // Pastikan path ini benar
import Sidebar from "@/components/Sidebar"; // Pastikan path ini benar

export default function DashboardLayout({
  children, // 'children' di sini adalah halaman seperti Dashboard, My Budget, dll.
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#091C2D] text-white">
      {/* Sidebar untuk desktop, akan hilang di mobile */}
      <Sidebar />

      {/* Konten Utama */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Navbar untuk mobile, akan hilang di desktop */}
        <Navbar />
        
          <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
