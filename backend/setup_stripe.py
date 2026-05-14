import os
import stripe
from dotenv import load_dotenv

# Load env variables from the actual path
load_dotenv(dotenv_path="C:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/solar-trainer/backend/.env")

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def create_product_and_prices(name, base_price, rep_price):
    print(f"Creating product: {name}")
    product = stripe.Product.create(name=name)
    
    # Create Base Price (Flat Fee)
    base = stripe.Price.create(
        product=product.id,
        unit_amount=int(base_price * 100),
        currency="usd",
        recurring={"interval": "month"},
    )
    
    # Create Rep Price (Per Unit)
    rep = stripe.Price.create(
        product=product.id,
        unit_amount=int(rep_price * 100),
        currency="usd",
        recurring={"interval": "month", "usage_type": "licensed"},
    )
    
    return base.id, rep.id

try:
    starter_base, starter_rep = create_product_and_prices("Solar Accelerator - Starter", 499, 39)
    print(f"Starter Success: Base={starter_base}, Rep={starter_rep}")
    
    growth_base, growth_rep = create_product_and_prices("Solar Accelerator - Growth", 999, 59)
    print(f"Growth Success: Base={growth_base}, Rep={growth_rep}")
    
    print("\n--- COPY THESE TO YOUR .env ---")
    print(f"STRIPE_PRICE_STARTER_BASE={starter_base}")
    print(f"STRIPE_PRICE_STARTER_REP={starter_rep}")
    print(f"STRIPE_PRICE_GROWTH_BASE={growth_base}")
    print(f"STRIPE_PRICE_GROWTH_REP={growth_rep}")

except Exception as e:
    print(f"Error: {e}")
