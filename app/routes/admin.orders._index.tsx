import { Link } from "react-router"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { mockOrders, orderStatusMap } from "~/types/order"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Input } from "~/components/ui/input"
import { useState } from "react"

type OrderStatus = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<OrderStatus>("all")
  const [search, setSearch] = useState("")

  const filteredOrders = mockOrders.filter((order) => {
    if (status !== "all" && order.status !== status) {
      return false
    }
    if (search) {
      const searchLower = search.toLowerCase()
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.items.some((item) =>
          item.product.name.toLowerCase().includes(searchLower)
        )
      )
    }
    return true
  })

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium">訂單管理</h3>
        <p className="text-sm text-muted-foreground">
          管理所有訂單狀態和詳細資訊
        </p>
      </div>

      <div className="flex gap-4">
        <div className="w-[180px]">
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as OrderStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="訂單狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部訂單</SelectItem>
              <SelectItem value="pending">待處理</SelectItem>
              <SelectItem value="processing">處理中</SelectItem>
              <SelectItem value="shipped">已出貨</SelectItem>
              <SelectItem value="delivered">已送達</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="搜尋訂單編號或商品名稱"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>訂單編號</TableHead>
              <TableHead>訂購時間</TableHead>
              <TableHead>商品</TableHead>
              <TableHead>總金額</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "yyyy/MM/dd HH:mm", {
                    locale: zhTW,
                  })}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="text-sm">
                        {item.product.name} x {item.quantity}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>NT$ {order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={orderStatusMap[order.status].variant}>
                    {orderStatusMap[order.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/orders/${order.id}`}>查看</Link>
                    </Button>
                    {order.status === "pending" && (
                      <Button size="sm">處理訂單</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 