import os
import http.client
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPID_KEY")
RAPIDAPI_HOST = os.getenv("RAPID_HOST")

conn = http.client.HTTPSConnection(RAPIDAPI_HOST)

headers = {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST
}

conn.request(
    "GET",
    "/estimated-salary?job_title=python%20developer&location=new%20york&location_type=ANY&years_of_experience=ALL",
    headers=headers
)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))
