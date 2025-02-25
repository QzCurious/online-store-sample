import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import type { ChangeEvent } from "react"

const forgotPasswordSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

type InputFieldType = {
  field: {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // TODO: 實作忘記密碼邏輯
    console.log(data)
  }

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">重設密碼</CardTitle>
          <CardDescription className="text-center">
            請輸入您的電子郵件，我們將發送重設密碼連結給您
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
              <Button type="submit" className="w-full">
                發送重設密碼連結
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
            返回登入頁面
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 