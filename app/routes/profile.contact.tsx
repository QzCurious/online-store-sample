import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import type { ChangeEvent } from "react"

const contactSchema = z.object({
  address: z.string().min(1, "請輸入地址"),
  phone: z.string().regex(/^0[2-9]\d{7,8}$/, "請輸入有效的市話號碼"),
})

type ContactFormData = z.infer<typeof contactSchema>

type InputFieldType = {
  field: {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

export default function ProfileContactPage() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      address: "",
      phone: "",
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    // TODO: 實作更新聯絡資訊邏輯
    console.log(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">聯絡資訊</h3>
        <p className="text-sm text-muted-foreground">
          更新您的聯絡地址和電話
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }: InputFieldType) => (
              <FormItem>
                <FormLabel>收件地址</FormLabel>
                <FormControl>
                  <Input placeholder="請輸入完整地址" {...field} />
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
                <FormLabel>聯絡電話</FormLabel>
                <FormControl>
                  <Input placeholder="0212345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">
              儲存變更
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 