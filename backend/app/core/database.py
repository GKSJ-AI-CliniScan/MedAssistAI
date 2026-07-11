from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging
import os
import json
from bson import ObjectId

logger = logging.getLogger(__name__)

# --- Mock JSON Database implementation for local fallback ---

class MockCursor:
    def __init__(self, data):
        self.data = data
        self.index = 0

    def sort(self, field, direction=1):
        reverse = direction == -1
        # Convert to string to avoid comparison issues between str and datetime
        self.data.sort(key=lambda x: str(x.get(field, "")), reverse=reverse)
        return self

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.index < len(self.data):
            val = self.data[self.index]
            self.index += 1
            return val
        else:
            raise StopAsyncIteration

class MockCollection:
    def __init__(self, name, filepath):
        self.name = name
        self.filepath = filepath
        self._load_data()

    def _load_data(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    self.data = json.load(f)
            except Exception as e:
                logger.error(f"Error loading mock file {self.filepath}: {e}")
                self.data = []
        else:
            self.data = []

    def _save_data(self):
        try:
            os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(self.data, f, default=str, indent=2)
        except Exception as e:
            logger.error(f"Error saving mock file {self.filepath}: {e}")

    async def find_one(self, query):
        for doc in self.data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return doc
        return None

    def find(self, query=None):
        if not query:
            return MockCursor(list(self.data))
        results = []
        for doc in self.data:
            match = True
            for k, v in query.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(doc)
        return MockCursor(results)

    async def insert_one(self, doc):
        if "_id" not in doc:
            doc["_id"] = str(ObjectId())
        self.data.append(doc)
        self._save_data()
        return doc

    async def insert_many(self, docs):
        for doc in docs:
            if "_id" not in doc:
                doc["_id"] = str(ObjectId())
            self.data.append(doc)
        self._save_data()
        return docs

    async def update_one(self, query, update):
        doc = await self.find_one(query)
        if doc:
            set_dict = update.get("$set", {})
            for k, v in set_dict.items():
                doc[k] = v
            self._save_data()
        return doc

    async def create_index(self, keys, unique=False):
        pass

    async def drop(self):
        self.data = []
        if os.path.exists(self.filepath):
            try:
                os.remove(self.filepath)
            except Exception:
                pass

class MockDatabase:
    def __init__(self):
        # Save JSON files in a data folder
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_dir = os.path.join(base_dir, "..", "..", "data")
        self.collections = {}

    def __getattr__(self, name):
        if name not in self.collections:
            filepath = os.path.join(self.data_dir, f"{name}.json")
            self.collections[name] = MockCollection(name, filepath)
        return self.collections[name]

# --- Database Client Initializer ---

class DatabaseHelper:
    client: AsyncIOMotorClient = None
    db = None
    is_mock = False

db_helper = DatabaseHelper()

async def connect_to_mongo():
    logger.info("Initializing database connection...")
    
    # Try real MongoDB connection
    try:
        # Set serverSelectionTimeoutMS to fail fast if MongoDB is not running
        db_helper.client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
        
        # Ping the server to verify it's reachable
        await db_helper.client.admin.command('ping')
        
        # Connection succeeded
        parts = settings.MONGODB_URL.split("/")
        db_name = parts[3].split("?")[0] if len(parts) > 3 else "medassist"
        if not db_name:
            db_name = "medassist"
            
        db_helper.db = db_helper.client[db_name]
        db_helper.is_mock = False
        logger.info(f"Connected to MongoDB database: {db_name}")
        
    except Exception as e:
        # Fallback to local JSON database
        logger.warning(f"Failed to connect to MongoDB ({e}). Falling back to local JSON database.")
        db_helper.db = MockDatabase()
        db_helper.is_mock = True
        logger.info("Using local JSON file-based database fallback.")

async def close_mongo_connection():
    logger.info("Closing database connection...")
    if not db_helper.is_mock and db_helper.client:
        db_helper.client.close()
        logger.info("MongoDB connection closed.")
    else:
        logger.info("Mock database connection finished.")

def get_database():
    if db_helper.db is None:
        raise RuntimeError("Database connection not initialized")
    return db_helper.db
