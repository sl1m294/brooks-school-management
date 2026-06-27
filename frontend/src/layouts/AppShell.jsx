import { BookOpen, LayoutDashboard, LogOut, Search, UserRound, UsersRound } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: UsersRound },
  { to: "/classes", label: "Classes", icon: BookOpen },
  { to: "/parent-preview", label: "Parent view", icon: UserRound }
];

const logo = "/assets/brooks-logo-transparent.png";

export function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-transparent">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-ink-900 px-5 py-5 text-white lg:block">
        <div className="flex items-center gap-3 px-2">
          <img src={logo} alt="Brooks School" className="h-12 w-36 rounded-full bg-white/95 object-contain px-3 py-1.5" />
          <div>
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-white/55">Workspace</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-ink-900"
                    : "text-white/72 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <item.icon size={18} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-900/86 text-white backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <img src={logo} alt="Brooks School" className="h-9 w-28 rounded-full bg-white/95 object-contain px-2 py-1 lg:hidden" />
              <div className="hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-white/58 sm:flex">
                <Search size={17} aria-hidden="true" />
                <span className="truncate text-sm">Search students, classes, or guardians</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-white/55">{user?.role}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white hover:text-ink-900"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-ink-200/70 bg-ink-50/95 p-4 shadow-soft sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
