import { createBrowserRouter, Navigate } from "react-router-dom";
import { RequireAuth } from "../auth/RequireAuth.jsx";
import { LoginPage } from "../features/auth/LoginPage.jsx";
import { DashboardPage } from "../features/dashboard/DashboardPage.jsx";
import { ParentPreviewPage } from "../features/parents/ParentPreviewPage.jsx";
import { StudentsPage } from "../features/students/StudentsPage.jsx";
import { AppShell } from "../layouts/AppShell.jsx";

function ComingSoon({ title }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">Coming soon</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink-900">{title}</h1>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <DashboardPage />
          },
          {
            path: "students",
            element: <StudentsPage />
          },
          {
            path: "classes",
            element: <ComingSoon title="Classes" />
          },
          {
            path: "parent-preview",
            element: <ParentPreviewPage />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
