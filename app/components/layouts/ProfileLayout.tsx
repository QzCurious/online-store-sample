import { Link, Outlet, useLocation } from "react-router"
import { cn } from "~/lib/utils"

const sidebarItems = [
  {
    title: "基本資料",
    href: "/profile",
  },
  {
    title: "聯絡資訊",
    href: "/profile/contact",
  },
  {
    title: "帳號安全",
    href: "/profile/security",
  },
  {
    title: "訂單記錄",
    href: "/profile/orders",
  },
]

export default function ProfileLayout() {
  const location = useLocation()

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-8">
        {/* 側邊欄 */}
        <aside className="w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* 主要內容區 */}
        <main className="flex-1">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
} 