import { Link } from "react-router"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { mockOrders } from "~/types/order"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { ProfileLayout } from "~/components/layout/ProfileLayout"

const orderStatusMap = {
  pending: {
    label: "待處理",
    variant: "secondary" as const,
  },
  processing: {
    label: "處理中",
    variant: "default" as const,
  },
  shipped: {
    label: "已出貨",
    variant: "default" as const,
  },
  delivered: {
    label: "已送達",
    variant: "default" as const,
  },
  cancelled: {
    label: "已取消",
    variant: "destructive" as const,
  },
}

export default function ProfileOrdersPage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">訂單記錄</h3>
          <p className="text-sm text-muted-foreground">
            查看您的所有訂單記錄和狀態
          </p>
        </div>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div key={order.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    訂單編號：{order.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    下單時間：
                    {format(new Date(order.createdAt), "PPP", {
                      locale: zhTW,
                    })}
                  </p>
                </div>
                <Badge variant={orderStatusMap[order.status].variant}>
                  {orderStatusMap[order.status].label}
                </Badge>
              </div>

              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      {item.variants && (
                        <p className="text-sm text-muted-foreground">
                          {Object.entries(item.variants)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" / ")}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        數量：{item.quantity}
                      </p>
                    </div>
                    <p className="text-right font-medium">
                      NT$ {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <p className="text-lg font-medium">
                  總計：NT$ {order.total.toLocaleString()}
                </p>
                <div className="space-x-2">
                  <Button asChild variant="outline">
                    <Link to={`/profile/orders/${order.id}`}>查看詳情</Link>
                  </Button>
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
          ))}
        </div>
      </div>
    </ProfileLayout>
  )
} 