import { Link, useParams } from "react-router"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { mockOrders, orderStatusMap } from "~/types/order"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { ArrowLeft } from "lucide-react"

export default function OrderDetailPage() {
  const { id } = useParams()
  const order = mockOrders.find((order) => order.id === id)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold">找不到訂單</h1>
        <p className="mt-2 text-muted-foreground">
          您要查看的訂單不存在或已被刪除
        </p>
        <Button asChild className="mt-8">
          <Link to="/profile/orders">返回訂單列表</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/profile/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h3 className="text-lg font-medium">訂單詳情</h3>
          <p className="text-sm text-muted-foreground">
            訂單編號：{order.id}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground">
        {/* 訂單狀態 */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                下單時間：
                {format(new Date(order.createdAt), "yyyy/MM/dd HH:mm", {
                  locale: zhTW,
                })}
              </div>
              <div className="text-sm text-muted-foreground">
                最後更新：
                {format(new Date(order.updatedAt), "yyyy/MM/dd HH:mm", {
                  locale: zhTW,
                })}
              </div>
            </div>
            <Badge variant={orderStatusMap[order.status].variant}>
              {orderStatusMap[order.status].label}
            </Badge>
          </div>
        </div>

        {/* 訂單商品 */}
        <div className="p-4">
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">
                        <Link
                          to={`/products/${item.product.id}`}
                          className="hover:underline"
                        >
                          {item.product.name}
                        </Link>
                      </h4>
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
                    <div className="text-right">
                      <div className="font-medium">
                        NT$ {(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        NT$ {item.price.toLocaleString()} x {item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 訂單資訊 */}
        <div className="border-t p-4">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">付款方式</span>
              <span>
                {order.paymentMethod === "credit-card"
                  ? "信用卡"
                  : "ATM 轉帳"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">配送方式</span>
              <span>
                {order.shippingMethod === "home-delivery"
                  ? "宅配到府"
                  : "超商取貨"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">配送地址</span>
              <span>{order.shippingAddress}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-medium">
              <span>總計</span>
              <span>NT$ {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 訂單操作 */}
        <div className="border-t p-4">
          <div className="flex justify-end gap-2">
            {order.status === "delivered" && (
              <Button asChild>
                <Link to={`/profile/orders/${order.id}/review`}>
                  評價商品
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 