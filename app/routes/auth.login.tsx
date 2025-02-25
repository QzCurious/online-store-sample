import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Checkbox } from "~/components/ui/checkbox"
import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import type { ChangeEvent } from "react"

const loginSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().min(8, "密碼至少需要 8 個字元"),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

type InputFieldType = {
  field: {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

type CheckboxFieldType = {
  field: {
    value: boolean;
    onChange: (checked: boolean) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

export default function LoginPage() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    // TODO: 實作登入邏輯
    console.log(data)
  }

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">登入帳號</CardTitle>
          <CardDescription className="text-center">
            請輸入您的電子郵件和密碼
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
                name="rememberMe"
                render={({ field }: CheckboxFieldType) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">記住我</FormLabel>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                登入
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
            忘記密碼？
          </Link>
          <Link to="/auth/register" className="text-sm text-muted-foreground hover:text-primary">
            註冊新帳號
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 