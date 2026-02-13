#!/bin/bash

# Nike Clone 開發環境啟動腳本

set -e

echo "🚀 啟動 Nike Clone 開發環境..."

# 檢查 Docker 是否運行
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker 未運行，請先啟動 Docker"
  exit 1
fi

# 啟動 PostgreSQL
echo "📦 啟動 PostgreSQL..."
docker compose up -d db

# 等待資料庫就緒
echo "⏳ 等待資料庫就緒..."
sleep 5

# 啟動後端
echo "🔧 啟動後端 API..."
cd backend

# 建立虛擬環境（如果不存在）
if [ ! -d "venv" ]; then
  echo "📦 建立 Python 虛擬環境..."
  python3 -m venv venv
fi

# 啟用虛擬環境並安裝依賴
source venv/bin/activate
pip install -r requirements.txt -q

# 執行種子資料
echo "🌱 初始化種子資料..."
python -c "from app.db.seed import seed_data; seed_data()" 2>/dev/null || true

# 啟動後端（背景執行）
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

cd ..

# 啟動前端
echo "🎨 啟動前端..."
cd frontend
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ 開發環境已啟動！"
echo ""
echo "📱 前端: http://localhost:5173"
echo "🔧 後端 API: http://localhost:8000"
echo "📚 API 文件: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服務"

# 等待中斷信號
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker compose stop db" SIGINT SIGTERM
wait
