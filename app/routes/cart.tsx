import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useCart } from "~/contexts/CartContext"
import { Minus, Plus, Trash2 } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16">
        <div className="rounded-lg border-2 border-dashed p-8 text-center">
          <h2 className="text-2xl font-medium">購物車是空的</h2>
          <p className="mt-2 text-muted-foreground">
            快去逛逛我們的商品吧！
          </p>
          <Button asChild className="mt-4">
            <Link to="/products">繼續購物</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">購物車</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* 購物車商品列表 */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.id}-${JSON.stringify(item.variants)}`}
                className="flex gap-4 rounded-lg border p-4"
              >
                {/* 商品圖片 */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* 商品資訊 */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">
                        <Link
                          to={`/products/${item.id}`}
                          className="hover:underline"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      {item.variants && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {Object.entries(item.variants).map(([key, value]) => (
                            <div key={key}>
                              {key}: {value}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="h-8 w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        NT$ {(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        NT$ {item.price.toLocaleString()} / 件
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 訂單摘要 */}
        <div className="lg:sticky lg:top-8">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-medium">訂單摘要</h2>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between border-b pb-4">
                <span className="text-muted-foreground">小計</span>
                <span className="font-medium">
                  NT$ {total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">運費</span>
                <span className="font-medium">免運</span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-medium">
                <span>總計</span>
                <span>NT$ {total.toLocaleString()}</span>
              </div>
              <Button asChild className="mt-2 w-full">
                <Link to="/checkout">前往結帳</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 