import urllib.request
import json

def get_json(url, headers=None):
    if headers is None:
        headers = {}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as res:
        return res.status, json.loads(res.read().decode())

def post_json(url, data):
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as res:
        return res.status, json.loads(res.read().decode())

def main():
    print("--- 1. Testing GET /api/attractions ---")
    status, attractions = get_json("http://localhost:8000/api/attractions")
    print(f"Status: {status}, Total Attractions: {len(attractions)}")
    for a in attractions:
        print(f"  [{a['category']}] {a['name']}")
    assert len(attractions) == 9, f"Expected 9 attractions, got {len(attractions)}"

    print("\n--- 2. Testing GET /api/tickets ---")
    status, tickets = get_json("http://localhost:8000/api/tickets")
    print(f"Status: {status}, Total Tickets: {len(tickets)}")
    for t in tickets:
        print(f"  {t['name']}: Rs. {t['price']} - {t['description']}")
    assert len(tickets) == 3, f"Expected 3 tickets, got {len(tickets)}"

    print("\n--- 3. Testing Admin Login ---")
    status, login_res = post_json("http://localhost:8000/api/auth/login", {
        "email": "admin@bluewave.com",
        "password": "Admin@123"
    })
    print(f"Status: {status}, Authenticated as: {login_res['user']['name']} ({login_res['user']['role']})")
    assert login_res["user"]["role"] == "admin", "User role must be admin"

    print("\n--- 4. Testing GET /api/admin/stats ---")
    token = login_res["access_token"]
    status, stats = get_json("http://localhost:8000/api/admin/stats", headers={"Authorization": f"Bearer {token}"})
    print(f"Status: {status}")
    print(f"  Total Customers: {stats['totalCustomers']}")
    print(f"  Total Bookings:  {stats['totalBookings']}")
    print(f"  Total Revenue:   Rs. {stats['totalRevenue']:,.2f}")

    assert stats["totalCustomers"] > 0, f"Expected totalCustomers > 0, got {stats['totalCustomers']}"
    assert stats["totalBookings"] > 0, f"Expected totalBookings > 0, got {stats['totalBookings']}"
    assert stats["totalRevenue"] > 0, f"Expected totalRevenue > 0, got {stats['totalRevenue']}"

    print("\n--- 5. Testing Customer Login (Nimal) ---")
    status, cust_login = post_json("http://localhost:8000/api/auth/login", {
        "email": "nimal@example.com",
        "password": "Customer@123"
    })
    print(f"Status: {status}, Authenticated as: {cust_login['user']['name']} ({cust_login['user']['role']})")
    assert cust_login["user"]["role"] == "customer", "User role must be customer"

    print("\n--- 6. Testing GET /api/bookings (Admin) ---")
    status, all_bookings = get_json("http://localhost:8000/api/bookings", headers={"Authorization": f"Bearer {token}"})
    print(f"Status: {status}, Total Bookings: {len(all_bookings)}")
    assert len(all_bookings) == 12, f"Expected 12 bookings, got {len(all_bookings)}"
    for b in all_bookings[:3]:
        print(f"  Guest: {b.get('userName')} ({b.get('userEmail')}) - Pass: {b.get('ticketName')} x {b.get('quantity')} = Rs. {b.get('totalAmount')} [{b.get('status')}] on {b.get('visitDate')}")

    print("\n--- 7. Testing GET /api/bookings/my (Customer Nimal) ---")
    cust_token = cust_login["access_token"]
    status, my_bookings = get_json("http://localhost:8000/api/bookings/my", headers={"Authorization": f"Bearer {cust_token}"})
    print(f"Status: {status}, Nimal's Bookings Count: {len(my_bookings)}")
    assert len(my_bookings) == 3, f"Expected 3 bookings for Nimal, got {len(my_bookings)}"
    for b in my_bookings:
        print(f"  Pass: {b.get('ticketName')} x {b.get('quantity')} = Rs. {b.get('totalAmount')} [{b.get('status')}] on {b.get('visitDate')}")

    print("\n=========================================")
    print("SUCCESS: ALL API VERIFICATIONS PASSED!")
    print("=========================================")

if __name__ == "__main__":
    main()
