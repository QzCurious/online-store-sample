import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~/db"
import { orders } from "~/db/schema/orders"
import type { ActionFunctionArgs } from "react-router"

const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
})

export const action = async ({ request, params }: ActionFunctionArgs) => {
  if (request.method !== "PATCH") {
    return { error: "Method not allowed" }
  }

  const { id } = params
  if (!id) {
    return { error: "Order ID is required" }
  }

  try {
    const body = await request.json()
    const { status } = updateOrderStatusSchema.parse(body)

    // 更新訂單狀態
    await db
      .update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))

    // 取得更新後的訂單
    const [updatedOrder] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)

    if (!updatedOrder) {
      return { error: "Order not found" }
    }

    return { order: updatedOrder }
  } catch (error) {
    console.error("Error updating order status:", error)
    if (error instanceof z.ZodError) {
      return { error: "Invalid status" }
    }
    return { error: "An error occurred while updating order status" }
  }
} 