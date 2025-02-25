import { Link, useLocation } from "react-router"
import { cn } from "~/lib/utils"

const menuItems = [
  {
    label: "基本資料",
    href: "/profile",
  },
  {
    label: "訂單記錄",
    href: "/profile/orders",
  },
  {
    label: "聯絡資訊",
    href: "/profile/contact",
  },
  {
    label: "帳號安全",
    href: "/profile/security",
  },
]

export function ProfileSidebar() {
  const location = useLocation()

  return (
    <nav className="w-64 space-y-1">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "block rounded-lg px-4 py-2 text-sm font-medium",
            location.pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
} 