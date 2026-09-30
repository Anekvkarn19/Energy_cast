import { NavLink } from "react-router-dom";
import {
  Activity,
  BrainCircuit,
  Gauge,
  Menu,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: Gauge,
    },
    {
      name: "Forecast",
      path: "/forecast",
      icon: TrendingUp,
    },
    { 
      name: "Predict",
      path: "/predict",
      icon: BrainCircuit },
    {
      name: "Model Performance",
      path: "/model-performance",
      icon: BrainCircuit,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: Activity,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          bg-[#0f172a] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="flex items-center justify-between border-b border-slate-700 px-5 py-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Zap size={21} />
              </div>

              <div>
                <h1 className="font-bold tracking-wide">
                  EnergyCast
                </h1>

                <p className="text-xs text-slate-400">
                  Forecasting Platform
                </p>
              </div>

            </div>

            {/* Close button - mobile only */}
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>

          </div>


          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}

          </nav>


          {/* System status */}
          <div className="border-t border-slate-700 p-5">

            <div className="rounded-xl bg-slate-800 p-4">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                <span className="text-sm font-medium">
                  System Online
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-400">
                XGBoost API connected
              </p>

            </div>

          </div>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;