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
| 資料庫 | PostgreSQL 16 |
| ORM | SQLModel |
| 認證 | JWT (PyJWT) + Argon2 (pwdlib) |
| 容器化 | Docker Compose |

## 快速開始

### 方式一：Docker Compose（推薦）

```bash
docker compose up -d
```

服務將在以下位置啟動：
- 前端: http://localhost:3737
- 後端 API: http://localhost:8787
- API 文件: http://localhost:8787/docs
- PostgreSQL: localhost:5432

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
uvicorn app.main:app --reload --port 8787
```

#### 3. 啟動前端

```bash
cd frontend
npm install
npm run dev
```

## 系統架構

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │          React SPA (Vite, port 3737)             │   │
│  │  ┌────────────┐ ┌──────────┐ ┌──────────────┐   │   │
│  │  │ AuthContext │ │CartContext│ │ React Query  │   │   │
│  │  │ (JWT管理)   │ │(購物車)   │ │ (快取/同步)   │   │   │
│  │  └─────┬──────┘ └────┬─────┘ └──────┬───────┘   │   │
│  │        └──────┬──────┘              │            │   │
│  │               ▼                     │            │   │
│  │  ┌────────────────────────┐         │            │   │
│  │  │   api.ts (HTTP Client) │◄────────┘            │   │
│  │  │ • Bearer Token 自動附加 │                      │   │
│  │  │ • 401 自動 Refresh     │                      │   │
│  │  │ • X-Session-Id 保留    │                      │   │
│  │  └────────────┬───────────┘                      │   │
│  └───────────────┼──────────────────────────────────┘   │
└──────────────────┼──────────────────────────────────────┘
                   │ HTTP (REST API)
                   ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (port 8787)                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │                  API Layer                       │    │
│  │  /api/v1/auth/*    認證 (register/login/refresh) │    │
│  │  /api/v1/products/* 產品查詢                      │    │
│  │  /api/v1/cart/*     購物車操作 (雙模式)            │    │
│  └──────────┬──────────────────────────┬────────────┘    │
│             │                          │                 │
│  ┌──────────▼──────────┐  ┌───────────▼────────────┐    │
│  │     Dependencies    │  │    Service Layer        │    │
│  │ • get_current_user  │  │ • AuthService           │    │
│  │   _optional         │  │   (認證 + 購物車合併)    │    │
│  │ • get_current_user  │  │ • CartService           │    │
│  │   _required         │  │   (雙模式購物車)         │    │
│  │ • get_session_id    │  └───────────┬─────────────┘    │
│  └─────────────────────┘              │                  │
│                                       │                  │
│  ┌────────────────────┐  ┌────────────▼─────────────┐    │
│  │   Security Core    │  │    SQLModel (ORM)        │    │
│  │ • Argon2 Hash      │  │ • User     (認證)        │    │
│  │ • JWT Sign/Verify  │  │ • Cart     (session/user)│    │
│  │ • Token生成/解碼   │  │ • CartItem (商品項目)     │    │
│  └────────────────────┘  │ • Product  (商品)         │    │
│                          └────────────┬──────────────┘    │
└───────────────────────────────────────┼──────────────────┘
                                        │
                                        ▼
                              ┌─────────────────┐
                              │  PostgreSQL 16   │
                              │  (port 5432)     │
                              │                  │
                              │  Tables:         │
                              │  • users         │
                              │  • carts         │
                              │  • cart_items    │
                              │  • products      │
                              │  • product_*     │
                              └─────────────────┘
```

## 認證系統

### 認證流程

```
匿名使用者                    註冊/登入後
────────────                ──────────────
X-Session-Id ──► 匿名購物車    Bearer Token ──► 使用者購物車
(localStorage)   (session_id)  (localStorage)   (user_id)
                                    │
                                    ▼
                              匿名購物車自動合併
                              至使用者購物車
```

### 雙模式購物車

| 模式 | 識別方式 | 說明 |
|------|---------|------|
| 匿名模式 | `X-Session-Id` header | 未登入使用者，以 localStorage UUID 識別 |
| 認證模式 | `Authorization: Bearer <token>` | 登入使用者，以 JWT 中的 user_id 識別 |

登入或註冊時，匿名購物車中的商品會自動合併至使用者購物車（相同商品數量加總，上限 10）。

### Token 機制

| Token | 有效期 | 用途 |
|-------|--------|------|
| Access Token | 30 分鐘 | API 認證 |
| Refresh Token | 7 天 | 換發新的 Access Token |

前端 `api.ts` 收到 401 回應時會自動嘗試 Token Refresh，成功則重送原請求，失敗則清除 tokens。

### 密碼安全

- 演算法：Argon2id（pwdlib）
- 最低長度：6 字元
- 儲存格式：Argon2 hash（不可逆）

## API 端點

### 產品

| 方法 | 端點 | 功能 |
|------|------|------|
| GET | `/api/v1/products` | 產品列表 |
| GET | `/api/v1/products/{slug}` | 產品詳情 |

### 購物車（匿名 + 認證雙模式）

| 方法 | 端點 | 功能 |
|------|------|------|
| GET | `/api/v1/cart` | 取得購物車 |
| POST | `/api/v1/cart/items` | 加入購物車 |
| PUT | `/api/v1/cart/items/{id}` | 更新數量 |
| DELETE | `/api/v1/cart/items/{id}` | 移除商品 |
| DELETE | `/api/v1/cart` | 清空購物車 |

### 認證

| 方法 | 端點 | 認證 | 功能 |
|------|------|------|------|
| POST | `/api/v1/auth/register` | - | 註冊（回傳 tokens + 合併匿名購物車） |
| POST | `/api/v1/auth/login` | - | 登入（回傳 tokens + 合併匿名購物車） |
| POST | `/api/v1/auth/refresh` | - | Token 刷新 |
| GET | `/api/v1/auth/me` | Bearer | 取得個人資料 |
| PUT | `/api/v1/auth/me` | Bearer | 更新個人資料 |
| POST | `/api/v1/auth/change-password` | Bearer | 變更密碼 |

## 前端路由

| 路徑 | 頁面 | 保護 |
|------|------|------|
| `/` | 首頁 | - |
| `/products` | 商品列表 | - |
| `/products/:slug` | 商品詳情 | - |
| `/cart` | 購物車 | - |
| `/login` | 登入 | - |
| `/register` | 註冊 | - |
| `/profile` | 個人資料 | 需登入 |

## 專案結構

```
tcnr01/
├── frontend/                    # React 前端
│   └── src/
│       ├── components/
│       │   ├── auth/            # ProtectedRoute
│       │   ├── cart/            # CartItem, CartDrawer
│       │   ├── layout/          # Header, Footer, Layout
│       │   ├── product/         # ProductCard, Gallery, etc.
│       │   └── ui/              # Button, Modal, Drawer, etc.
│       ├── context/
│       │   ├── AuthContext.tsx   # 認證狀態 (user, login, logout)
│       │   └── CartContext.tsx   # 購物車狀態
│       ├── pages/               # 頁面元件
│       ├── services/
│       │   ├── api.ts           # HTTP Client (token 管理)
│       │   ├── authService.ts   # 認證 API 呼叫
│       │   └── cartService.ts   # 購物車 API 呼叫
│       ├── types/               # TypeScript 型別定義
│       └── hooks/               # 自訂 Hooks
│
├── backend/                     # FastAPI 後端
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── auth.py          # 認證端點
│   │   │   ├── cart.py          # 購物車端點 (雙模式)
│   │   │   └── products.py      # 產品端點
│   │   ├── core/
│   │   │   ├── config.py        # 設定 (含 JWT 參數)
│   │   │   ├── deps.py          # FastAPI Dependencies
│   │   │   ├── security.py      # 密碼雜湊 + JWT
│   │   │   └── exceptions.py    # 自訂例外
│   │   ├── models/
│   │   │   ├── user.py          # User model
│   │   │   ├── cart.py          # Cart model (含 user_id)
│   │   │   └── product.py       # Product model
│   │   ├── schemas/             # Pydantic Schemas
│   │   ├── services/
│   │   │   ├── auth_service.py  # 認證邏輯 + 購物車合併
│   │   │   └── cart_service.py  # 購物車邏輯
│   │   └── db/                  # DB session + seed
│   ├── alembic/                 # Database migrations
│   └── migrate.sql              # 獨立 SQL migration 腳本
│
└── docker-compose.yaml
```

## Database Schema

```
┌──────────────────┐         ┌──────────────────┐
│      users       │         │     products     │
├──────────────────┤         ├──────────────────┤
│ id          (PK) │    ┌───►│ id          (PK) │
│ email    (UQ,IX) │    │    │ slug        (UQ) │
│ password_hash    │    │    │ name             │
│ first_name       │    │    │ price            │
│ last_name        │    │    │ category         │
│ phone            │    │    └──────────────────┘
│ address_line1    │    │
│ city, state, ... │    │
│ country (TW)     │    │
│ is_active        │    │
│ created/updated  │    │
└────────┬─────────┘    │
         │              │
         │ 1:N          │
         ▼              │
┌──────────────────┐    │    ┌──────────────────┐
│      carts       │    │    │   cart_items      │
├──────────────────┤    │    ├──────────────────┤
│ id          (PK) │◄───┼───┤ cart_id      (FK) │
│ session_id  (IX) │    │    │ product_id   (FK)─┘
│ user_id  (FK,IX) │────┘    │ color_id         │
│ created/updated  │         │ size_id          │
└──────────────────┘         │ quantity (1-10)  │
                             └──────────────────┘
```

## 環境變數

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `DATABASE_URL` | `postgresql://tcnr01:tcnr01123@localhost:5432/tcnr01_db` | 資料庫連線字串 |
| `SECRET_KEY` | `super-secret-key-change-in-production` | JWT 簽名金鑰（正式環境務必更換） |
| `ALGORITHM` | `HS256` | JWT 演算法 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Access Token 有效分鐘數 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Refresh Token 有效天數 |

## Database Migration

若在已有資料的環境中需要升級 schema：

```bash
# 方式一：Alembic（推薦）
docker compose exec backend alembic upgrade head

# 方式二：SQL 腳本
docker compose exec db psql -U tcnr01 -d tcnr01_db < backend/migrate.sql
```

## 功能特色

- ✅ TCNR01 風格 UI 設計系統
- ✅ 產品列表與詳情頁面
- ✅ 購物車功能（Session 管理）
- ✅ 使用者註冊 / 登入 / 登出
- ✅ JWT 認證 + 自動 Token Refresh
- ✅ 登入時匿名購物車自動合併
- ✅ 個人資料管理（含寄送地址）
- ✅ 密碼變更（Argon2 雜湊）
- ✅ 受保護路由（ProtectedRoute）
- ✅ 響應式設計
- ✅ TypeScript 類型安全
- ✅ TanStack Query 資料快取
