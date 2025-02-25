import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto py-16">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-6 text-2xl font-bold">訂單已成立</h1>
        <p className="mt-2 text-muted-foreground">
          感謝您的購買！我們已收到您的訂單，並將盡快為您處理。
        </p>
        <div className="mt-8 space-x-4">
          <Button asChild variant="outline">
            <Link to="/products">繼續購物</Link>
          </Button>
          <Button asChild>
            <Link to="/profile/orders">查看訂單</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 