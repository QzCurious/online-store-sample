import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import type { ChangeEvent } from "react"

const registerSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().min(8, "密碼至少需要 8 個字元"),
  confirmPassword: z.string().min(8, "密碼至少需要 8 個字元"),
  name: z.string().min(2, "姓名至少需要 2 個字元"),
  phone: z.string().regex(/^09\d{8}$/, "請輸入有效的手機號碼"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密碼不一致",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

type InputFieldType = {
  field: {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

export default function RegisterPage() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    // TODO: 實作註冊邏輯
    console.log(data)
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">註冊帳號</CardTitle>
          <CardDescription className="text-center">
            請填寫以下資料以完成註冊
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }: InputFieldType) => (
                  <FormItem>
                    <FormLabel>電子郵件</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="password"
                render={({ field }: InputFieldType) => (
                  <FormItem>
                    <FormLabel>密碼</FormLabel>
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
                    <FormLabel>確認密碼</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                註冊
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
            已有帳號？點此登入
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 