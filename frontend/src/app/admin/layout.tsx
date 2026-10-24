import AdminGuard from "@/components/admin-guard";

// STRICT AUTH PROTECTION: every /admin route renders behind the guard,
// which bounces signed-out visitors to /login (as the prototype did).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>;
}
