import { Link, useParams } from "react-router"
import { Button } from "~/components/ui/button"
import { mockOrders } from "~/types/order"
import { ArrowLeft } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { useToast } from "~/components/ui/toast-context"

const reviewSchema = z.object({
  rating: z.enum(["1", "2", "3", "4", "5"]),
  content: z.string().min(10, "評價內容至少需要 10 個字").max(500, "評價內容不能超過 500 個字"),
})

type ReviewFormData = z.infer<typeof reviewSchema>

export default function OrderReviewPage() {
  const { id } = useParams()
  const { toast } = useToast()
  const order = mockOrders.find((order) => order.id === id)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: "5",
      content: "",
    },
  })

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold">找不到訂單</h1>
        <p className="mt-2 text-muted-foreground">
          您要評價的訂單不存在或已被刪除
        </p>
        <Button asChild className="mt-8">
          <Link to="/profile/orders">返回訂單列表</Link>
        </Button>
      </div>
    )
  }

  if (order.status !== "delivered") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-2xl font-bold">無法評價</h1>
        <p className="mt-2 text-muted-foreground">
          只有已完成的訂單才能進行評價
        </p>
        <Button asChild className="mt-8">
          <Link to={`/profile/orders/${order.id}`}>返回訂單詳情</Link>
        </Button>
      </div>
    )
  }

  const onSubmit = async (data: ReviewFormData) => {
    // TODO: 實作評價提交功能
    console.log(data)
    toast({
      title: "評價已送出",
      description: "感謝您的評價！",
    })
    window.history.back()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/profile/orders/${order.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h3 className="text-lg font-medium">商品評價</h3>
          <p className="text-sm text-muted-foreground">
            訂單編號：{order.id}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border bg-card text-card-foreground"
          >
            <div className="p-4">
              <div className="flex gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
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
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 space-y-4 border-t pt-4"
              >
                <div className="space-y-2">
                  <Label>評分</Label>
                  <RadioGroup
                    defaultValue={watch("rating")}
                    className="flex gap-4"
                    onValueChange={(value: string) =>
                      register("rating").onChange({
                        target: { value, name: "rating" },
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div
                        key={value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={value.toString()}
                          id={`rating-${value}`}
                        />
                        <Label htmlFor={`rating-${value}`}>{value} 分</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">評價內容</Label>
                  <Textarea
                    id="content"
                    placeholder="請分享您對商品的使用心得..."
                    {...register("content")}
                  />
                  {errors.content && (
                    <p className="text-sm text-destructive">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    取消
                  </Button>
                  <Button type="submit">送出評價</Button>
                </div>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 