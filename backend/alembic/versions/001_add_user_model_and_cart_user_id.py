"""add user model and cart user_id

Revision ID: 001
Revises:
Create Date: 2026-02-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. 建立 users 資料表
    op.create_table(
        'users',
        sa.Column('id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('email', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('password_hash', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('first_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('last_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('phone', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('address_line1', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('address_line2', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('city', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('state', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('postal_code', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('country', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. carts 新增 user_id 欄位（nullable FK）
    op.add_column('carts', sa.Column('user_id', sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    op.create_foreign_key('fk_carts_user_id_users', 'carts', 'users', ['user_id'], ['id'])
    op.create_index(op.f('ix_carts_user_id'), 'carts', ['user_id'])

    # 3. carts.session_id 改為 nullable 並移除 unique 約束
    op.alter_column('carts', 'session_id', existing_type=sa.VARCHAR(), nullable=True)

    # 移除 session_id 的 unique 約束（約束名稱可能不同，嘗試常見名稱）
    try:
        op.drop_constraint('uq_carts_session_id', 'carts', type_='unique')
    except Exception:
        pass

    try:
        op.drop_index('ix_carts_session_id', table_name='carts')
    except Exception:
        pass

    # 重建 session_id index（非 unique）
    op.create_index(op.f('ix_carts_session_id'), 'carts', ['session_id'])


def downgrade() -> None:
    # 移除 carts.user_id
    op.drop_index(op.f('ix_carts_user_id'), table_name='carts')
    op.drop_constraint('fk_carts_user_id_users', 'carts', type_='foreignkey')
    op.drop_column('carts', 'user_id')

    # 恢復 carts.session_id 為 NOT NULL + unique
    op.alter_column('carts', 'session_id', existing_type=sa.VARCHAR(), nullable=False)
    op.drop_index(op.f('ix_carts_session_id'), table_name='carts')
    op.create_index('ix_carts_session_id', 'carts', ['session_id'], unique=True)

    # 刪除 users 資料表
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
