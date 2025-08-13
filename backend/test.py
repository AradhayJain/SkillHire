import http.client

conn = http.client.HTTPSConnection("jsearch.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "44a467a97bmshac69335af424410p1089bajsn5df057aa9768",
    'x-rapidapi-host': "jsearch.p.rapidapi.com"
}

conn.request("GET", "/search?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=in&date_posted=all", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))