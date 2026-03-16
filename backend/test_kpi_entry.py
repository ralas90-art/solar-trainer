from sqlmodel import SQLModel, Field
from datetime import date
from typing import Optional

try:
    class KPIEntry(SQLModel, table=True):
        date: date = Field(index=True)
        value: int
    print("KPIEntry definition successful")
except Exception as e:
    print(f"KPIEntry Error: {e}")
