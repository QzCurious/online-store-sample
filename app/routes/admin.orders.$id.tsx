import { Link, useParams, useFetcher } from "react-router"
import { Button } from "~/components/ui/button"
import { mockOrders, orderStatusMap, type Order } from "~/types/order"
import { ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { Badge } from "~/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useState } from "react"
import { useToast } from "~/components/ui/toast-context"

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const order = mockOrders.find((order) => order.id === id)
  const [status, setStatus] = useState<Order["status"]>(
    order?.status || "pending"
  )
  const fetcher = useFetcher()

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold">找不到訂單</h1>
        <p className="mt-2 text-muted-foreground">
          您要查看的訂單不存在或已被刪除
        </p>
        <Button asChild className="mt-8">
          <Link to="/admin/orders">返回訂單列表</Link>
        </Button>
      </div>
    )
  }

  const handleStatusChange = async (newStatus: Order["status"]) => {
    fetcher.submit(
      { status: newStatus },
      {
        method: "PATCH",
        action: `/api/orders/${order.id}/update-status`,
      }
    )
  }

  // 處理 API 回應
  if (fetcher.data) {
    if (fetcher.data.error) {
      toast({
        title: "更新失敗",
        description: fetcher.data.error,
        variant: "destructive",
      })
    } else if (fetcher.data.order) {
      const updatedOrder = fetcher.data.order as Order
      setStatus(updatedOrder.status)
      toast({
        title: "訂單狀態已更新",
        description: `訂單狀態已更新為${orderStatusMap[updatedOrder.status].label}`,
      })
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/orders">
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground">
            <div className="p-6">
              <h4 className="font-medium">訂單狀態</h4>
              <div className="mt-4 space-y-4">
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
                  <Badge variant={orderStatusMap[status || order.status].variant}>
                    {orderStatusMap[status || order.status].label}
                  </Badge>
                </div>
                <div className="pt-4">
                  <Select
                    value={status}
                    onValueChange={handleStatusChange}
                    disabled={fetcher.state !== "idle"}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="更新訂單狀態" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">待處理</SelectItem>
                      <SelectItem value="processing">處理中</SelectItem>
                      <SelectItem value="shipped">已出貨</SelectItem>
                      <SelectItem value="delivered">已送達</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground">
            <div className="p-6">
              <h4 className="font-medium">訂購商品</h4>
              <div className="mt-4 space-y-4">
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
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground">
            <div className="p-6">
              <h4 className="font-medium">付款資訊</h4>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">付款方式</span>
                  <span>
                    {order.paymentMethod === "credit-card"
                      ? "信用卡"
                      : "ATM 轉帳"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">商品總額</span>
                  <span>NT$ {order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">運費</span>
                  <span>免運</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-medium">
                  <span>總計</span>
                  <span>NT$ {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground">
            <div className="p-6">
              <h4 className="font-medium">配送資訊</h4>
              <div className="mt-4 space-y-2 text-sm">
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
                {status === "shipped" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">物流追蹤</span>
                    <Button variant="link" className="h-auto p-0">
                      查看物流狀態
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 