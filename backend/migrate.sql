-- Migration: add_user_model_and_cart_user_id
-- 建立 users 表、修改 carts 表支援雙模式（匿名 session + 認證使用者）

BEGIN;

-- 1. 建立 users 資料表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR NOT NULL PRIMARY KEY,
    email VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    phone VARCHAR,
    address_line1 VARCHAR,
    address_line2 VARCHAR,
    city VARCHAR,
    state VARCHAR,
    postal_code VARCHAR,
    country VARCHAR NOT NULL DEFAULT 'TW',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_users_email ON users (email);

-- 2. carts 新增 user_id 欄位
ALTER TABLE carts ADD COLUMN IF NOT EXISTS user_id VARCHAR REFERENCES users(id);
CREATE INDEX IF NOT EXISTS ix_carts_user_id ON carts (user_id);

-- 3. carts.session_id 改為 nullable
ALTER TABLE carts ALTER COLUMN session_id DROP NOT NULL;

-- 4. 移除 session_id 的 unique 約束（如果存在）
-- 注意：約束名稱可能因環境不同而異，先查詢再刪除
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- 刪除 unique index
    FOR constraint_name IN
        SELECT indexname FROM pg_indexes
        WHERE tablename = 'carts' AND indexdef LIKE '%unique%' AND indexdef LIKE '%session_id%'
    LOOP
        EXECUTE format('DROP INDEX IF EXISTS %I', constraint_name);
    END LOOP;

    -- 刪除 unique constraint
    FOR constraint_name IN
        SELECT conname FROM pg_constraint
        WHERE conrelid = 'carts'::regclass AND contype = 'u'
        AND conname LIKE '%session_id%'
    LOOP
        EXECUTE format('ALTER TABLE carts DROP CONSTRAINT IF EXISTS %I', constraint_name);
    END LOOP;
END $$;

-- 5. 重建 session_id 的普通 index（非 unique）
DROP INDEX IF EXISTS ix_carts_session_id;
CREATE INDEX ix_carts_session_id ON carts (session_id);

-- 6. 建立 alembic_version 表追蹤 migration 狀態
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL,
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

DELETE FROM alembic_version;
INSERT INTO alembic_version (version_num) VALUES ('001');

COMMIT;
