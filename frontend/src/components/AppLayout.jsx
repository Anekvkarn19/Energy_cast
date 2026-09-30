import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main area */}
      <div className="lg:ml-64">

        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex items-center border-b border-slate-200 bg-white px-4 py-3 lg:hidden">

          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
          >
            <Menu size={21} />
          </button>

          <div className="ml-3">

            <p className="text-sm font-bold text-slate-900">
              EnergyCast
            </p>

            <p className="text-xs text-slate-500">
              Forecasting Platform
            </p>

          </div>

        </div>

        {children}

      </div>

    </div>
  );
}

export default AppLayout;