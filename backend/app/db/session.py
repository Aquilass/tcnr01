from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy import inspect, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    _apply_schema_updates()


def _apply_schema_updates():
    """Apply schema updates for existing tables that create_all won't handle."""
    inspector = inspect(engine)

    if "carts" in inspector.get_table_names():
        columns = [c["name"] for c in inspector.get_columns("carts")]
        if "user_id" not in columns:
            with engine.begin() as conn:
                conn.execute(text(
                    "ALTER TABLE carts ADD COLUMN user_id VARCHAR REFERENCES users(id)"
                ))
                conn.execute(text(
                    "CREATE INDEX IF NOT EXISTS ix_carts_user_id ON carts (user_id)"
                ))
                conn.execute(text(
                    "ALTER TABLE carts ALTER COLUMN session_id DROP NOT NULL"
                ))

    if "order_items" in inspector.get_table_names():
        columns = [c["name"] for c in inspector.get_columns("order_items")]
        if "product_slug" not in columns:
            with engine.begin() as conn:
                conn.execute(text(
                    "ALTER TABLE order_items ADD COLUMN product_slug VARCHAR NOT NULL DEFAULT ''"
                ))


def get_session():
    with Session(engine) as session:
        yield session
