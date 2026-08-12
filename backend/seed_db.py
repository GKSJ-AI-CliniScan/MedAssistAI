import json
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# Adjust this URL if your docker-compose uses a different MongoDB connection string
MONGO_URL = os.getenv("MONGODB_URL", "mongodb://mongodb:27017/medassist")
BASE_DIR = os.path.dirname(__file__)
SYMPTOMS_PATH = os.path.join(BASE_DIR, "models", "symptoms_list.json")

async def seed_database():
    print("Connecting to database...")
    client = AsyncIOMotorClient(MONGO_URL)
    db = client.get_default_database()

    # 1. Wipe the existing symptoms collection completely
    print("Wiping old symptoms from the database...")
    await db.symptoms.drop()

    # 2. Load the exact XGBoost model symptoms
    print("Loading symptoms_list.json...")
    with open(SYMPTOMS_PATH, "r") as f:
        raw_symptoms = json.load(f)

    # 3. Format them for the frontend
    formatted_symptoms = []
    for sym in raw_symptoms:
        formatted_symptoms.append({
            "key": sym,
            # Capitalize the first letter of each word for the UI
            "display_name": sym.title(), 
            # Defaulting to General. You can update these later in your DB.
            "category": "General" 
        })

    # 4. Insert the clean data
    if formatted_symptoms:
        await db.symptoms.insert_many(formatted_symptoms)
        print(f"Successfully inserted {len(formatted_symptoms)} pristine symptoms!")
    else:
        print("No symptoms found in the JSON file.")

if __name__ == "__main__":
    asyncio.run(seed_database())