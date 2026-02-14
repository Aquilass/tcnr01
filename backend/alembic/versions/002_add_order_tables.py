"""add order tables

Revision ID: 002
Revises: 001
Create Date: 2026-02-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'orders',
        sa.Column('id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('order_number', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('session_id', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('user_id', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('status', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('payment_method', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('payment_status', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('items_total', sa.Float(), nullable=False),
        sa.Column('shipping_fee', sa.Float(), nullable=False),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('recipient_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('recipient_phone', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('shipping_address', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('shipping_city', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('shipping_state', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('shipping_postal_code', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('notes', sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
    )
    op.create_index(op.f('ix_orders_order_number'), 'orders', ['order_number'], unique=True)
    op.create_index(op.f('ix_orders_session_id'), 'orders', ['session_id'])
    op.create_index(op.f('ix_orders_user_id'), 'orders', ['user_id'])

    op.create_table(
        'order_items',
        sa.Column('id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('order_id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('product_id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('product_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('product_image', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('color_id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('color_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('size_id', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('size', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id']),
    )


def downgrade() -> None:
    op.drop_table('order_items')
    op.drop_index(op.f('ix_orders_user_id'), table_name='orders')
    op.drop_index(op.f('ix_orders_session_id'), table_name='orders')
    op.drop_index(op.f('ix_orders_order_number'), table_name='orders')
    op.drop_table('orders')
