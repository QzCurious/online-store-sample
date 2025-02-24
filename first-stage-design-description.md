# 設計風格指南

## 1. 視覺設計系統

### 品牌識別系統
- **品牌標誌**：
  - 主標誌：深藍色橫式標誌
  - 輔助標誌：單色版本用於深色背景
  - 最小使用尺寸：80px 寬度
  - 安全間距：標誌高度的 1/2

- **圖形元素**：
  - 幾何圖形：使用 45 度斜線和圓形元素
  - 裝飾線條：2px 粗細的虛線或實線
  - 背景圖案：低調的點狀或網格紋理

### 圖標系統
- **功能圖標**：
  - 線條粗細：2px
  - 尺寸規範：24x24px（預設）
  - 圓角：2px
  - 統一風格：線性圖標，首選

- **狀態圖標**：
  - 成功：綠色 `#4CAF50`
  - 警告：橙色 `#FF9800`
  - 錯誤：紅色 `#F44336`
  - 信息：藍色 `#2196F3`

### 色彩系統
- **主色調**：
  - 主要品牌色：現代感的深藍色 `#1A237E`
  - 次要品牌色：活力珊瑚色 `#FF7F50`
  - 強調色：明亮的青綠色 `#00BFA5`

- **中性色階**：
  - 背景色：純白 `#FFFFFF`
  - 次要背景：淺灰 `#F5F5F5`
  - 文字主色：深灰 `#333333`
  - 次要文字：中灰 `#666666`
  - 分隔線：淺灰 `#EEEEEE`

### 陰影系統
- **元素陰影**：
  - 淺層：`0 2px 4px rgba(0,0,0,0.1)`
  - 中層：`0 4px 8px rgba(0,0,0,0.1)`
  - 深層：`0 8px 16px rgba(0,0,0,0.1)`
  - 浮動：`0 12px 24px rgba(0,0,0,0.15)`

### 字體系統
- **標題層級**：
  - H1：32px/粗體 - 用於頁面主標題
  - H2：24px/粗體 - 用於區塊標題
  - H3：20px/粗體 - 用於子區塊標題
  - H4：18px/粗體 - 用於卡片標題

- **內文字體**：
  - 正文：16px/常規
  - 小字：14px/常規
  - 標註：12px/常規

### 間距系統
- 基礎單位：8px
- 內間距（Padding）：16px/24px/32px
- 外間距（Margin）：16px/24px/32px
- 元素間距：8px/16px/24px

### 圓角規範
- 大圓角：12px（用於卡片、模態框）
- 中圓角：8px（用於按鈕、輸入框）
- 小圓角：4px（用於標籤、提示）

### 組件設計規範

#### 按鈕系統
- **主要按鈕** (`Button` variant="default")：
  - 使用 shadcn/ui Button 組件
  - 基礎樣式：`bg-primary text-primary-foreground`
  - 懸停效果：`hover:bg-primary/90`
  - 禁用狀態：`disabled:opacity-50`
  - 大小變體：`size="default" | "sm" | "lg"`

- **次要按鈕** (`Button` variant="outline")：
  - 邊框：`border border-input`
  - 背景：`bg-background`
  - 懸停效果：`hover:bg-accent hover:text-accent-foreground`
  - 支持所有 Button variants

- **文字按鈕** (`Button` variant="ghost")：
  - 基礎樣式：`hover:bg-accent hover:text-accent-foreground`
  - 過渡效果：內建動畫

#### 表單元素
- **輸入框** (`Input` 組件)：
  - 使用 shadcn/ui Input 組件
  - 基礎樣式：內建樣式
  - 搭配 `Label` 組件使用
  - 表單驗證：配合 `Form` 組件

- **選擇器** (`Select` 組件)：
  - 使用 shadcn/ui Select 組件
  - 觸發器：`SelectTrigger`
  - 內容：`SelectContent`
  - 選項：`SelectItem`
  - 支持分組：`SelectGroup`

- **複選框/單選框**：
  - 使用 `Checkbox` 和 `RadioGroup` 組件
  - 標籤使用 `Label` 組件
  - 表單集成：`Form` 控制

#### 卡片設計
- **商品卡片** (`Card` 組件)：
  - 使用 shadcn/ui Card 組件系列
  - 結構：
    ```jsx
    <Card>
      <CardHeader>
        <CardTitle>商品名稱</CardTitle>
        <CardDescription>簡短描述</CardDescription>
      </CardHeader>
      <CardContent>商品內容</CardContent>
      <CardFooter>價格與操作</CardFooter>
    </Card>
    ```
  - 懸停效果：`hover:shadow-lg transition-shadow`

- **對話框與彈出層**：
  - 使用 `Dialog`、`Sheet`、`Drawer` 組件
  - 響應式考慮：Desktop 用 Dialog，Mobile 用 Drawer

#### 數據展示
- **表格** (`Table` 組件)：
  - 使用 shadcn/ui Table 組件
  - 支持排序、篩選
  - 響應式設計：小屏幕摺疊顯示

- **列表** (`Command` 組件)：
  - 用於搜索和選擇界面
  - 支持鍵盤導航
  - 自定義渲染項

#### 導航組件
- **頁籤** (`Tabs` 組件)：
  - 用於分類切換
  - 支持響應式設計
  - 動畫過渡效果

- **下拉菜單** (`DropdownMenu` 組件)：
  - 用於更多操作
  - 支持子菜單
  - 鍵盤可訪問性

#### 反饋組件
- **Toast** 通知：
  - 使用 `useToast` hook
  - 位置：右上角
  - 動畫：滑入滑出

- **加載狀態**：
  - 使用 `Skeleton` 組件
  - 漸變動畫效果
  - 適配內容大小

### 主題定制
- **顏色變量**：
  ```css
  :root {
    --primary: #1A237E;
    --primary-foreground: #FFFFFF;
    --secondary: #FF7F50;
    --secondary-foreground: #FFFFFF;
    --accent: #00BFA5;
    --accent-foreground: #FFFFFF;
    --background: #FFFFFF;
    --foreground: #333333;
    --muted: #F5F5F5;
    --muted-foreground: #666666;
    --border: #EEEEEE;
  }
  ```

- **黑暗模式**：
  ```css
  .dark {
    --primary: #2196F3;
    --background: #1A1A1A;
    --foreground: #FFFFFF;
    --muted: #333333;
    --muted-foreground: #999999;
    --border: #333333;
  }
  ```

### 響應式設計
- **Container** 組件：
  ```jsx
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
    {/* 內容 */}
  </div>
  ```

- **Grid** 布局：
  ```jsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* 商品卡片 */}
  </div>
  ```

### 動畫規範
- **過渡效果**：
  - 快速：`transition duration-200`
  - 中等：`transition duration-300`
  - 緩慢：`transition duration-400`

- **動畫曲線**：
  - 標準：`ease-[cubic-bezier(0.4,0,0.2,1)]`
  - 進入：`ease-[cubic-bezier(0,0,0.2,1)]`
  - 退出：`ease-[cubic-bezier(0.4,0,1,1)]`

### 網格系統
- **基礎網格**：
  - 列數：12列
  - 列間距：24px
  - 邊距：
    - Desktop：64px
    - Tablet：32px
    - Mobile：16px

- **容器寬度**：
  - 最大寬度：1440px
  - 最小寬度：320px

### 圖片規範
- **商品圖片**：
  - 主圖尺寸：800x800px
  - 縮圖尺寸：400x400px
  - 列表圖：200x200px
  - 格式：WebP（備用 JPG）
  - 品質：85%

- **橫幅圖片**：
  - Desktop：1920x600px
  - Tablet：1024x400px
  - Mobile：750x400px

- **背景圖片**：
  - 格式：WebP
  - 壓縮率：較高
  - 載入策略：漸進式

# 頁面互動設計細節

## 1. 全局導航與搜索

### 導航欄互動
- **滾動行為**：
  - 向下滾動時自動隱藏
  - 向上滾動時顯示
  - 頂部固定時加入淺微陰影

- **搜索框互動**：
  - 點擊展開加寬
  - 輸入時即時顯示建議結果
  - 建議結果支持鍵盤導航
  - ESC鍵可快速清空

- **購物車預覽**：
  - 滑鼠懸停顯示迷你購物車
  - 動態顯示最近添加商品
  - 帶有輕微彈出動畫

## 2. 商品列表頁互動

### 篩選器行為
- **側邊欄響應**：
  - Desktop：固定在左側
  - Tablet：可收合的側邊欄
  - Mobile：底部彈出抽屜

- **篩選條件**：
  - 選中後即時更新結果
  - 多選條件以標籤形式顯示
  - 可一鍵清除所有篩選

### 商品卡片互動
- **滑鼠懸停效果**：
  - 輕微上浮陰影
  - 顯示快速操作按鈕
  - 圖片切換效果

- **加入購物車**：
  - 點擊出現成功動畫
  - 購物車圖標數字更新動效
  - 可選擇繼續購物或查看購物車

## 3. 商品詳情頁互動

### 圖片查看
- **主圖區域**：
  - 滑鼠懸停顯示放大鏡效果
  - 點擊開啟全屏查看模式
  - 支持手勢縮放

- **縮圖導航**：
  - 滑動切換效果
  - 當前圖片高亮標示
  - 支持觸控滑動

### 規格選擇
- **顏色/尺寸選擇**：
  - 選中狀態明顯標示
  - 庫存不足選項置灰
  - 選擇錯誤時提供提示

- **數量選擇**：
  - 支持直接輸入
  - 超出庫存限制時提示
  - 帶有數字變化動畫

## 4. 購物車互動

### 商品操作
- **數量調整**：
  - 即時更新總價
  - 數量變化動畫
  - 低於1自動詢問是否刪除

- **刪除商品**：
  - 滑動刪除（移動端）
  - 刪除確認提示
  - 優雅的移除動畫

### 結帳流程
- **表單驗證**：
  - 即時驗證反饋
  - 錯誤提示動態顯示
  - 自動格式化輸入

- **步驟切換**：
  - 流暢的過渡動畫
  - 進度條動態更新
  - 可返回修改

## 5. 響應式設計斷點

### 斷點設定
- Desktop：≥1200px
- Tablet：768px-1199px
- Mobile：≤767px

### 布局適配
- **Desktop**：
  - 商品列表：4列網格
  - 側邊欄固定展示
  - 完整導航菜單

- **Tablet**：
  - 商品列表：3列網格
  - 可收合側邊欄
  - 精簡導航菜單

- **Mobile**：
  - 商品列表：2列網格
  - 底部彈出篩選器
  - 漢堡菜單導航

## 6. 動畫與過渡效果

### 微互動設計
- **按鈕狀態**：
  - Hover：輕微放大
  - Active：按壓效果
  - Loading：旋轉動畫

- **頁面切換**：
  - 平滑淡入效果
  - 內容塊依序載入
  - 骨架屏過渡

### 載入狀態
- **預載入**：
  - 骨架屏動畫
  - 漸進式圖片載入
  - 平滑過渡效果

### 響應式設計
- **斷點設定**：
  ```js
  screens: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  }
  ```

- **容器寬度**：
  - 最大寬度：`max-w-7xl mx-auto`
  - 內邊距：`px-4 sm:px-6 lg:px-8`

### 圖片處理
- **商品圖片**：
  - 主圖：`aspect-square object-cover`
  - 縮圖：`aspect-square object-cover`
  - 列表圖：`aspect-square object-cover`
  - 加載效果：`blur-up lazyload`

- **背景圖片**：
  - 漸進式載入
  - 背景位置：`bg-center bg-cover`
  - 優化尺寸：`next-image-loader`
