import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import type { ChangeEvent } from "react"

const securitySchema = z.object({
  currentPassword: z.string().min(8, "密碼至少需要 8 個字元"),
  newPassword: z.string().min(8, "密碼至少需要 8 個字元"),
  confirmPassword: z.string().min(8, "密碼至少需要 8 個字元"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "新密碼不一致",
  path: ["confirmPassword"],
})

type SecurityFormData = z.infer<typeof securitySchema>

type InputFieldType = {
  field: {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

export default function ProfileSecurityPage() {
  const form = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SecurityFormData) => {
    // TODO: 實作更新密碼邏輯
    console.log(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">帳號安全</h3>
        <p className="text-sm text-muted-foreground">
          更新您的密碼以確保帳號安全
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }: InputFieldType) => (
              <FormItem>
                <FormLabel>目前密碼</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }: InputFieldType) => (
              <FormItem>
                <FormLabel>新密碼</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }: InputFieldType) => (
              <FormItem>
                <FormLabel>確認新密碼</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit">
              更新密碼
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 