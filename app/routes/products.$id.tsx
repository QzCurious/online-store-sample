import { useParams } from "react-router"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useState } from "react"
import { useCart } from "~/contexts/CartContext"

// 模擬商品數據
const mockProduct = {
  id: "1",
  name: "精選咖啡豆",
  price: 450,
  description: "來自衣索比亞的精選咖啡豆，具有獨特的花香和水果香氣。每一顆咖啡豆都經過嚴格挑選，確保最佳品質。適合手沖、義式濃縮等多種沖煮方式。",
  images: [
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
  ],
  inStock: true,
  variants: {
    roast: ["淺焙", "中焙", "深焙"],
    grind: ["咖啡豆", "粗粒", "中粒", "細粒"],
  },
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState({
    roast: "",
    grind: "",
  })
  const [quantity, setQuantity] = useState(1)

  // 檢查是否已選擇所有必要的規格
  const canAddToCart = selectedVariants.roast && selectedVariants.grind && quantity > 0

  const handleAddToCart = () => {
    if (canAddToCart && mockProduct.inStock) {
      addItem({
        id: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
        image: mockProduct.images[0],
        quantity: quantity,
        variants: selectedVariants,
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* 左側商品圖片 */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={mockProduct.images[selectedImage]}
              alt={mockProduct.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {mockProduct.images.map((image, index) => (
              <button
                key={index}
                className={`aspect-square overflow-hidden rounded-lg border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${mockProduct.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 右側商品資訊 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{mockProduct.name}</h1>
            <p className="mt-4 text-lg font-medium">
              NT$ {mockProduct.price.toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>烘焙程度</Label>
              <Select
                value={selectedVariants.roast}
                onValueChange={(value) =>
                  setSelectedVariants({ ...selectedVariants, roast: value })
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="選擇烘焙程度" />
                </SelectTrigger>
                <SelectContent>
                  {mockProduct.variants.roast.map((roast) => (
                    <SelectItem key={roast} value={roast}>
                      {roast}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>研磨方式</Label>
              <Select
                value={selectedVariants.grind}
                onValueChange={(value) =>
                  setSelectedVariants({ ...selectedVariants, grind: value })
                }
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="選擇研磨方式" />
                </SelectTrigger>
                <SelectContent>
                  {mockProduct.variants.grind.map((grind) => (
                    <SelectItem key={grind} value={grind}>
                      {grind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>數量</Label>
              <div className="mt-1.5 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              disabled={!canAddToCart || !mockProduct.inStock}
              onClick={handleAddToCart}
            >
              {mockProduct.inStock
                ? canAddToCart
                  ? "加入購物車"
                  : "請選擇商品規格"
                : "缺貨中"}
            </Button>
            {!mockProduct.inStock && (
              <Badge variant="destructive" className="w-full justify-center">
                缺貨中
              </Badge>
            )}
          </div>

          <div className="prose prose-sm max-w-none border-t pt-6">
            <h2 className="text-lg font-medium">商品說明</h2>
            <p className="mt-4 whitespace-pre-line">{mockProduct.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 