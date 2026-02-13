from sqlmodel import Session, select
from app.models import Product, ProductImage, ProductColor, ProductSize
from app.db.session import engine


def seed_data():
    with Session(engine) as session:
        # Check if data already exists
        existing = session.exec(select(Product)).first()
        if existing:
            print("Data already seeded")
            return

        # TCNR01 Air Max 1
        product1 = Product(
            slug="tcnr01-air-max-1",
            name="TCNR01 Air Max 1",
            subtitle="男鞋",
            description="""TCNR01 Air Max 1 重新定義運動鞋的經典設計。

這款標誌性鞋款採用可見式 Air 氣墊單元，搭配優質皮革和網布鞋面，兼具透氣性與耐用性。

特色：
• 可見式 Air Max 氣墊
• 優質皮革與網布鞋面
• 橡膠外底提供耐久抓地力
• 經典配色歷久彌新

鞋款靈感源自 1987 年原版設計，持續引領街頭潮流。""",
            price=4500,
            original_price=5200,
            category="男鞋",
        )
        session.add(product1)
        session.flush()

        # Product 1 Images
        images1 = [
            ProductImage(
                product_id=product1.id,
                url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
                alt="TCNR01 Air Max 1 側面",
                is_main=True,
                sort_order=0,
            ),
            ProductImage(
                product_id=product1.id,
                url="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
                alt="TCNR01 Air Max 1 正面",
                is_main=False,
                sort_order=1,
            ),
            ProductImage(
                product_id=product1.id,
                url="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80",
                alt="TCNR01 Air Max 1 背面",
                is_main=False,
                sort_order=2,
            ),
            ProductImage(
                product_id=product1.id,
                url="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
                alt="TCNR01 Air Max 1 細節",
                is_main=False,
                sort_order=3,
            ),
        ]
        for img in images1:
            session.add(img)

        # Product 1 Colors
        colors1 = [
            ProductColor(
                product_id=product1.id,
                name="大學紅/白",
                code="#C41E3A",
                image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80",
                sort_order=0,
            ),
            ProductColor(
                product_id=product1.id,
                name="黑/白",
                code="#111111",
                image_url="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=120&q=80",
                sort_order=1,
            ),
            ProductColor(
                product_id=product1.id,
                name="海軍藍/白",
                code="#000080",
                image_url="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=120&q=80",
                sort_order=2,
            ),
        ]
        for color in colors1:
            session.add(color)

        # Product 1 Sizes
        sizes1 = [
            ProductSize(product_id=product1.id, size="US 7", stock=5, sort_order=0),
            ProductSize(product_id=product1.id, size="US 7.5", stock=3, sort_order=1),
            ProductSize(product_id=product1.id, size="US 8", stock=8, sort_order=2),
            ProductSize(product_id=product1.id, size="US 8.5", stock=10, sort_order=3),
            ProductSize(product_id=product1.id, size="US 9", stock=12, sort_order=4),
            ProductSize(product_id=product1.id, size="US 9.5", stock=6, sort_order=5),
            ProductSize(product_id=product1.id, size="US 10", stock=4, sort_order=6),
            ProductSize(product_id=product1.id, size="US 10.5", stock=0, sort_order=7),
            ProductSize(product_id=product1.id, size="US 11", stock=2, sort_order=8),
            ProductSize(product_id=product1.id, size="US 12", stock=0, sort_order=9),
        ]
        for size in sizes1:
            session.add(size)

        # TCNR01 Air Force 1 '07
        product2 = Product(
            slug="tcnr01-air-force-1-07",
            name="TCNR01 Air Force 1 '07",
            subtitle="男鞋",
            description="""這款籃球傳奇鞋款延續經典元素，同時增添清新風格。

耐穿縫線鞋面搭配流暢的設計線條和低筒造型，展現經典不敗的休閒風格。招牌 TCNR01 Air 緩震設計，讓你全天舒適。

特色：
• 低筒造型，經典百搭
• TCNR01 Air 緩震技術
• 耐穿皮革鞋面
• 經典設計元素

自 1982 年推出以來，Air Force 1 持續定義街頭文化。""",
            price=3600,
            category="男鞋",
        )
        session.add(product2)
        session.flush()

        # Product 2 Images
        images2 = [
            ProductImage(
                product_id=product2.id,
                url="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
                alt="TCNR01 Air Force 1 側面",
                is_main=True,
                sort_order=0,
            ),
            ProductImage(
                product_id=product2.id,
                url="https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=80",
                alt="TCNR01 Air Force 1 俯視",
                is_main=False,
                sort_order=1,
            ),
        ]
        for img in images2:
            session.add(img)

        # Product 2 Colors
        colors2 = [
            ProductColor(
                product_id=product2.id,
                name="白/白",
                code="#FFFFFF",
                image_url="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=120&q=80",
                sort_order=0,
            ),
            ProductColor(
                product_id=product2.id,
                name="黑/黑",
                code="#111111",
                image_url="https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=120&q=80",
                sort_order=1,
            ),
        ]
        for color in colors2:
            session.add(color)

        # Product 2 Sizes
        sizes2 = [
            ProductSize(product_id=product2.id, size="US 7", stock=10, sort_order=0),
            ProductSize(product_id=product2.id, size="US 8", stock=15, sort_order=1),
            ProductSize(product_id=product2.id, size="US 9", stock=20, sort_order=2),
            ProductSize(product_id=product2.id, size="US 10", stock=18, sort_order=3),
            ProductSize(product_id=product2.id, size="US 11", stock=8, sort_order=4),
            ProductSize(product_id=product2.id, size="US 12", stock=5, sort_order=5),
        ]
        for size in sizes2:
            session.add(size)

        # TCNR01 Dunk Low
        product3 = Product(
            slug="tcnr01-dunk-low-retro",
            name="TCNR01 Dunk Low Retro",
            subtitle="男鞋",
            description="""復古籃球風格遇上現代街頭時尚。

這款鞋款沿用 1985 年的原版設計，採用優質皮革鞋面搭配經典配色，無論是上場打球或是日常穿搭都完美適合。

特色：
• 優質皮革鞋面
• 經典 Dunk 配色
• 低筒設計便於穿脫
• 橡膠外底提供抓地力

Dunk 系列自誕生以來，從球場走向街頭，成為潮流文化的標誌性鞋款。""",
            price=3200,
            category="男鞋",
        )
        session.add(product3)
        session.flush()

        # Product 3 Images
        images3 = [
            ProductImage(
                product_id=product3.id,
                url="https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80",
                alt="TCNR01 Dunk Low 側面",
                is_main=True,
                sort_order=0,
            ),
        ]
        for img in images3:
            session.add(img)

        # Product 3 Colors
        colors3 = [
            ProductColor(
                product_id=product3.id,
                name="熊貓",
                code="#111111",
                image_url="https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=120&q=80",
                sort_order=0,
            ),
        ]
        for color in colors3:
            session.add(color)

        # Product 3 Sizes
        sizes3 = [
            ProductSize(product_id=product3.id, size="US 7", stock=2, sort_order=0),
            ProductSize(product_id=product3.id, size="US 8", stock=0, sort_order=1),
            ProductSize(product_id=product3.id, size="US 9", stock=5, sort_order=2),
            ProductSize(product_id=product3.id, size="US 10", stock=3, sort_order=3),
        ]
        for size in sizes3:
            session.add(size)

        # TCNR01 Air Jordan 1
        product4 = Product(
            slug="air-jordan-1-retro-high-og",
            name="Air Jordan 1 Retro High OG",
            subtitle="男鞋",
            description="""傳奇鞋款的經典重現。

Air Jordan 1 High OG 重新詮釋 Michael Jordan 的首款簽名球鞋，採用優質皮革鞋面和經典 Wings 標誌，展現無與倫比的籃球傳統。

特色：
• OG 高筒設計
• 優質皮革鞋面
• 經典 Wings 標誌
• Air-Sole 緩震單元

這不只是一雙鞋，而是一個傳奇的開端。""",
            price=5400,
            category="男鞋",
        )
        session.add(product4)
        session.flush()

        # Product 4 Images
        images4 = [
            ProductImage(
                product_id=product4.id,
                url="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
                alt="Air Jordan 1 側面",
                is_main=True,
                sort_order=0,
            ),
            ProductImage(
                product_id=product4.id,
                url="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
                alt="Air Jordan 1 細節",
                is_main=False,
                sort_order=1,
            ),
        ]
        for img in images4:
            session.add(img)

        # Product 4 Colors
        colors4 = [
            ProductColor(
                product_id=product4.id,
                name="芝加哥",
                code="#C41E3A",
                image_url="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=120&q=80",
                sort_order=0,
            ),
        ]
        for color in colors4:
            session.add(color)

        # Product 4 Sizes
        sizes4 = [
            ProductSize(product_id=product4.id, size="US 8", stock=1, sort_order=0),
            ProductSize(product_id=product4.id, size="US 9", stock=2, sort_order=1),
            ProductSize(product_id=product4.id, size="US 10", stock=3, sort_order=2),
            ProductSize(product_id=product4.id, size="US 11", stock=1, sort_order=3),
        ]
        for size in sizes4:
            session.add(size)

        # TCNR01 React Infinity Run
        product5 = Product(
            slug="tcnr01-react-infinity-run-flyknit-3",
            name="TCNR01 React Infinity Run Flyknit 3",
            subtitle="女鞋",
            description="""專為長距離跑步設計的舒適避震體驗。

Flyknit 鞋面提供透氣包覆感，React 泡棉中底帶來柔軟彈性的緩震效果，幫助減少跑步時的受傷風險。

特色：
• Flyknit 透氣鞋面
• React 泡棉緩震中底
• 加寬鞋身設計增加穩定性
• 耐穿橡膠外底

無論你是剛開始跑步或是資深跑者，這款鞋都能提供你所需的支撐與舒適。""",
            price=4900,
            category="女鞋",
        )
        session.add(product5)
        session.flush()

        # Product 5 Images
        images5 = [
            ProductImage(
                product_id=product5.id,
                url="https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
                alt="TCNR01 React Infinity Run 側面",
                is_main=True,
                sort_order=0,
            ),
        ]
        for img in images5:
            session.add(img)

        # Product 5 Colors
        colors5 = [
            ProductColor(
                product_id=product5.id,
                name="粉白",
                code="#FFB6C1",
                image_url="https://images.unsplash.com/photo-1539185441755-769473a23570?w=120&q=80",
                sort_order=0,
            ),
        ]
        for color in colors5:
            session.add(color)

        # Product 5 Sizes
        sizes5 = [
            ProductSize(product_id=product5.id, size="US 6", stock=8, sort_order=0),
            ProductSize(product_id=product5.id, size="US 6.5", stock=10, sort_order=1),
            ProductSize(product_id=product5.id, size="US 7", stock=12, sort_order=2),
            ProductSize(product_id=product5.id, size="US 7.5", stock=6, sort_order=3),
            ProductSize(product_id=product5.id, size="US 8", stock=4, sort_order=4),
        ]
        for size in sizes5:
            session.add(size)

        # TCNR01 Blazer Mid '77
        product6 = Product(
            slug="tcnr01-blazer-mid-77-vintage",
            name="TCNR01 Blazer Mid '77 Vintage",
            subtitle="男女通用鞋款",
            description="""復古球場風格，展現經典魅力。

Blazer Mid '77 承襲 1977 年原版設計，採用做舊處理的皮革鞋面，展現復古磨損質感，彷彿穿越時空回到黃金年代。

特色：
• 復古做舊質感
• 優質皮革鞋面
• 經典中筒設計
• 暴露式泡棉鞋舌

這款鞋是懷舊情懷與現代風格的完美結合。""",
            price=2980,
            category="男女通用",
        )
        session.add(product6)
        session.flush()

        # Product 6 Images
        images6 = [
            ProductImage(
                product_id=product6.id,
                url="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
                alt="TCNR01 Blazer Mid 側面",
                is_main=True,
                sort_order=0,
            ),
        ]
        for img in images6:
            session.add(img)

        # Product 6 Colors
        colors6 = [
            ProductColor(
                product_id=product6.id,
                name="白/黑",
                code="#FFFFFF",
                image_url="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=120&q=80",
                sort_order=0,
            ),
        ]
        for color in colors6:
            session.add(color)

        # Product 6 Sizes
        sizes6 = [
            ProductSize(product_id=product6.id, size="US 6", stock=5, sort_order=0),
            ProductSize(product_id=product6.id, size="US 7", stock=8, sort_order=1),
            ProductSize(product_id=product6.id, size="US 8", stock=10, sort_order=2),
            ProductSize(product_id=product6.id, size="US 9", stock=12, sort_order=3),
            ProductSize(product_id=product6.id, size="US 10", stock=8, sort_order=4),
            ProductSize(product_id=product6.id, size="US 11", stock=6, sort_order=5),
        ]
        for size in sizes6:
            session.add(size)

        session.commit()
        print("Seed data created successfully!")


if __name__ == "__main__":
    from app.db.session import create_db_and_tables
    create_db_and_tables()
    seed_data()
