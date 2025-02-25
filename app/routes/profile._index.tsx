import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import type { ChangeEvent } from "react"
import { ProfileLayout } from "~/components/layout/ProfileLayout"

const profileSchema = z.object({
  name: z.string().min(2, "姓名至少需要 2 個字元"),
  email: z.string().email("請輸入有效的電子郵件"),
  phone: z.string().regex(/^09\d{8}$/, "請輸入有效的手機號碼"),
  birthday: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

type InputFieldType = {
  field: {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

type DateFieldType = {
  field: {
    value: string | undefined;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<any>;
  };
}

export default function ProfileBasicPage() {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthday: "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    // TODO: 實作更新個人資料邏輯
    console.log(data)
  }

  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">基本資料</h3>
          <p className="text-sm text-muted-foreground">
            更新您的個人基本資料
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="birthday"
              render={({ field }: DateFieldType) => (
                <FormItem>
                  <FormLabel>生日</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ""} />
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
    </ProfileLayout>
  )
} 