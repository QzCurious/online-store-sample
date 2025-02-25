import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useCart } from "~/contexts/CartContext"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import type { ChangeEvent } from "react"

const checkoutSchema = z.object({
  name: z.string().min(2, "請輸入姓名"),
  phone: z.string().regex(/^09\d{8}$/, "請輸入有效的手機號碼"),
  email: z.string().email("請輸入有效的電子郵件"),
  address: z.string().min(1, "請輸入地址"),
  payment: z.enum(["credit-card", "atm"], {
    required_error: "請選擇付款方式",
  }),
  shipping: z.enum(["home-delivery", "convenience-store"], {
    required_error: "請選擇配送方式",
  }),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

type InputFieldType = {
  field: {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      payment: "credit-card",
      shipping: "home-delivery",
    },
  })

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: 實作結帳邏輯
      console.log(data)
      // 模擬 API 請求
      await new Promise((resolve) => setTimeout(resolve, 1000))
      clearCart()
      navigate("/checkout/success")
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    navigate("/cart")
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">結帳</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* 結帳表單 */}
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-medium">收件資訊</h2>
                <div className="mt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }: InputFieldType) => (
                      <FormItem>
                        <FormLabel>姓名</FormLabel>
                        <FormControl>
                          <Input placeholder="請輸入姓名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }: InputFieldType) => (
                      <FormItem>
                        <FormLabel>手機號碼</FormLabel>
                        <FormControl>
                          <Input placeholder="0912345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }: InputFieldType) => (
                      <FormItem>
                        <FormLabel>電子郵件</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }: InputFieldType) => (
                      <FormItem>
                        <FormLabel>地址</FormLabel>
                        <FormControl>
                          <Input placeholder="請輸入完整地址" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-medium">付款方式</h2>
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="payment"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇付款方式" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit-card">信用卡</SelectItem>
                            <SelectItem value="atm">ATM 轉帳</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-medium">配送方式</h2>
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="shipping"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇配送方式" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home-delivery">宅配到府</SelectItem>
                            <SelectItem value="convenience-store">
                              超商取貨
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* 訂單摘要 */}
        <div className="lg:sticky lg:top-8">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-medium">訂單摘要</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${JSON.stringify(item.variants)}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="flex-1">
                      {item.name}
                      {item.variants && (
                        <span className="text-muted-foreground">
                          {" "}
                          ({Object.values(item.variants).join(", ")})
                        </span>
                      )}
                      <span className="text-muted-foreground"> x{item.quantity}</span>
                    </span>
                    <span>NT$ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-muted-foreground">小計</span>
                <span className="font-medium">NT$ {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">運費</span>
                <span className="font-medium">免運</span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-medium">
                <span>總計</span>
                <span>NT$ {total.toLocaleString()}</span>
              </div>
              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isSubmitting ? "處理中..." : "確認結帳"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 