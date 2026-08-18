import asyncio
import json
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings


async def main():
    json_path = Path(__file__).resolve().parent.parent / "models" / "symptoms_list.json"

    with open(json_path, "r", encoding="utf-8") as f:
        symptoms = json.load(f)

    print(f"Found {len(symptoms)} symptoms.")

    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client["medassist"]

    await db.symptoms.drop()

    documents = []

    for symptom in symptoms:
        display_name = symptom.strip()

        if not display_name:
            continue

        key = (
            display_name.lower()
            .strip()
            .replace(" ", "_")
            .replace("-", "_")
            .replace("/", "_")
        )

        documents.append({
            "key": key,
            "display_name": display_name
        })

    if documents:
        await db.symptoms.insert_many(documents)

    await db.symptoms.create_index("key", unique=True)

    count = await db.symptoms.count_documents({})

    print(f"Successfully inserted {count} symptoms.")

    client.close()


if __name__ == "__main__":
    asyncio.run(main())