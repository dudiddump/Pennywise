import Navbar from "@/components/MobileNav"; 
import Sidebar from "@/components/Sidebar"; 

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#091C2D] text-whitewhite">
      <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-[rgba(52,211,153,0.15)] blur-[100px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-[rgba(59,130,246,0.15)] blur-[100px]"></div>
      </div>

      <div className="flex h-screen">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-y-auto">
          <Navbar />  
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
