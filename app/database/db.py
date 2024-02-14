from pymongo import MongoClient

class Database:
    client: MongoClient = None
    db_name: str = "item"

    def connect(self):
        self.client = MongoClient("mongodb://localhost:27017/" + self.db_name)

    def get_client(self) -> MongoClient:
        if not self.client:
            self.connect()
        return self.client

db = Database()
