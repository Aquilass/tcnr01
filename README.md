# TCNR01 購物網站複刻專案

使用 React + Tailwind CSS (前端) 和 FastAPI + PostgreSQL (後端) 建立的 TCNR01 風格購物網站。

## 技術棧

| 層級 | 技術 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 前端樣式 | Tailwind CSS 3.4 |
| 前端建置 | Vite |
| 狀態管理 | React Context + TanStack Query |
| 後端框架 | FastAPI |
| 資料庫 | PostgreSQL |
| ORM | SQLModel |
| 容器化 | Docker Compose |

## 快速開始

### 方式一：Docker Compose（推薦）

```bash
docker compose up
```

服務將在以下位置啟動：
- 前端: http://localhost:5173
- 後端 API: http://localhost:8000
- API 文件: http://localhost:8000/docs

### 方式二：本地開發

#### 1. 啟動資料庫

```bash
docker compose up -d db
```

#### 2. 啟動後端

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 執行種子資料
python -c "from app.db.seed import seed_data; seed_data()"

# 啟動伺服器
uvicorn app.main:app --reload
```

#### 3. 啟動前端

```bash
cd frontend
npm install
npm run dev
```

## API 端點

| 方法 | 端點 | 功能 |
|------|------|------|
| GET | /api/v1/products | 產品列表 |
| GET | /api/v1/products/{slug} | 產品詳情 |
| GET | /api/v1/cart | 取得購物車 |
| POST | /api/v1/cart/items | 加入購物車 |
| PUT | /api/v1/cart/items/{id} | 更新數量 |
| DELETE | /api/v1/cart/items/{id} | 移除商品 |
| DELETE | /api/v1/cart | 清空購物車 |

## 專案結構

```
tcnr01/
├── frontend/               # React 前端
│   ├── src/
│   │   ├── components/     # UI 元件
│   │   ├── pages/          # 頁面元件
│   │   ├── hooks/          # 自訂 Hooks
│   │   ├── services/       # API 服務
│   │   ├── context/        # Context Providers
│   │   ├── types/          # TypeScript 類型
│   │   └── utils/          # 工具函數
│   └── tailwind.config.js  # Tailwind 設定
│
├── backend/                # FastAPI 後端
│   └── app/
│       ├── api/v1/         # API 路由
│       ├── models/         # SQLModel 模型
│       ├── schemas/        # Pydantic Schemas
│       ├── services/       # 業務邏輯
│       └── db/             # 資料庫設定
│
└── compose.yml             # Docker Compose
```

## 功能特色

- ✅ TCNR01 風格 UI 設計系統
- ✅ 產品列表與詳情頁面
- ✅ 購物車功能（Session 管理）
- ✅ 響應式設計
- ✅ TypeScript 類型安全
- ✅ TanStack Query 資料快取
