import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { useCart } from "~/contexts/CartContext"

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  inStock: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  return (
    <Card className="overflow-hidden">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link
          to={`/products/${product.id}`}
          className="block hover:underline"
        >
          <h3 className="text-lg font-medium">{product.name}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">
            NT$ {product.price.toLocaleString()}
          </span>
          {!product.inStock && (
            <Badge variant="destructive">缺貨中</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          {product.inStock ? "加入購物車" : "缺貨中"}
        </Button>
      </CardFooter>
    </Card>
  )
} 