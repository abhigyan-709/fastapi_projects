# Connect to MongoDB
from pymongo import MongoClient
from dotenv import dotenv_values
from bson import UuidRepresentation, json_util

config = dotenv_values(".env")
client = MongoClient(config['MONGODB_SRV_URL'], uuidRepresentation='standard')

db = client["GTOneAPIDB"]


