import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"
import { ShoppingCart, User, Coffee, Menu } from "lucide-react"
import { useCart } from "~/contexts/CartContext"
import { mockCategories } from "~/types/category"
import { cn } from "~/lib/utils"
import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "~/components/ui/sheet"

export function Navbar() {
  const { items } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        {/* 手機版選單按鈕 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="mt-8 space-y-4">
              <Link
                to="/products"
                className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                所有商品
              </Link>
              {mockCategories.map((category) => (
                <div key={category.id} className="space-y-2">
                  <Link
                    to={`/categories/${category.slug}`}
                    className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    {category.name}
                  </Link>
                  {category.children?.map((child) => (
                    <Link
                      key={child.id}
                      to={`/categories/${category.slug}/${child.slug}`}
                      className="block rounded-lg px-4 py-2 pl-8 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Coffee className="h-6 w-6" />
          <span className="hidden sm:inline">咖啡商店</span>
        </Link>

        {/* 主導航 */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>商品分類</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                  {mockCategories.map((category) => (
                    <li key={category.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={`/categories/${category.slug}`}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="text-sm font-medium leading-none">{category.name}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {category.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/products" className={navigationMenuTriggerStyle()}>
                所有商品
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* 搜尋欄 */}
        <form onSubmit={handleSearch} className="flex-1">
          <Input
            type="search"
            placeholder="搜尋商品..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:max-w-[300px]"
          />
        </form>

        {/* 用戶功能區 */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {items.length}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
} 