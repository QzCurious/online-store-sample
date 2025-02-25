import { sql } from "drizzle-orm"
import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core"
import { products } from "./products"
import { users } from "./users"

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status", {
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
  }).notNull(),
  paymentMethod: text("payment_method", {
    enum: ["credit-card", "atm"],
  }).notNull(),
  shippingMethod: text("shipping_method", {
    enum: ["home-delivery", "convenience-store"],
  }).notNull(),
  shippingAddress: text("shipping_address").notNull(),
  total: real("total").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$default(() => sql`CURRENT_TIMESTAMP`),
})

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  variants: text("variants", { mode: "json" }),
})

export const orderReviews = sqliteTable("order_reviews", {
  id: text("id").primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => sql`CURRENT_TIMESTAMP`),
}) 