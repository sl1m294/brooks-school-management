import { BookOpen, GraduationCap, LayoutDashboard, LogOut, Search, UserRound, UsersRound } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: UsersRound },
  { to: "/classes", label: "Classes", icon: BookOpen },
  { to: "/parent-preview", label: "Parent view", icon: UserRound }
];

export function AppShell() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink-200 bg-white px-4 py-5 lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-meadow-600 text-white">
            <GraduationCap size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900">Brooks School</p>
            <p className="text-xs text-ink-500">Admin workspace</p>
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
                    ? "bg-meadow-50 text-meadow-700"
                    : "text-ink-700 hover:bg-ink-50 hover:text-ink-900"
                }`
              }
            >
              <item.icon size={18} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-ink-200 bg-white/92 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink-100 text-ink-700 lg:hidden">
                <GraduationCap size={20} aria-hidden="true" />
              </div>
              <div className="hidden min-w-0 max-w-md flex-1 items-center gap-2 rounded-md border border-ink-200 bg-ink-50 px-3 py-2 text-ink-500 sm:flex">
                <Search size={17} aria-hidden="true" />
                <span className="truncate text-sm">Search students, classes, or guardians</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-ink-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-ink-500">{user?.role}</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-700 transition hover:bg-ink-50"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
