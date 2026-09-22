# 🌊 Bluewave Water Park Management System

A comprehensive web-based management and ticketing system built for Bluewave Water Park to manage online ticket bookings, rides, packages, visitor management, and administrative operations.

---

## ✨ Features

- 🎟️ **Online Ticket Booking:** Visitors can select ticket types, visit dates, quantities, and view automatically calculated prices.
- 🏄 **Attractions & Rides:** Browse BlueWave attractions including SpeedBay, SplashBay, and ChillBay with descriptions and details.
- 🔐 **Authentication & Security:** Secure registration and login with JWT-based authentication and role-based access for customers and administrators.
- 📊 **Admin Dashboard:** Manage attractions, ticket types, bookings, customers, and view booking and revenue statistics.
- ⭐ **Customer Reviews:** Customers can submit ratings and reviews, while administrators can manage and moderate reviews.
- 🧾 **Booking Confirmation:** View booking details including ticket type, visit date, quantity, and total price.
- 🌙 **Dark / Light Mode:** Users can switch between dark and light themes.
- 📱 **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
- 🔔 **Notifications:** User-friendly feedback for successful bookings, authentication, and system actions.

---

## 🎟️ Ticket Booking Flow

```text
Select Ticket Type
        ↓
Select Visit Date
        ↓
Select Quantity
        ↓
Calculate Total Price
        ↓
Booking Summary
        ↓
Confirm Booking
        ↓
Booking Confirmation
## 🏄 Main Attractions

### SpeedBay
**High-Speed Water Slides**  
Experience exciting high-speed water slides, thrilling turns, and adrenaline-filled adventures.

### SplashBay
**Water Splash & Play Area**  
Enjoy splash zones, wave pools, and fun-filled water activities for visitors of all ages.

### ChillBay
**Relaxation & Leisure Area**  
Relax and enjoy family-friendly water activities and comfortable leisure spaces.

---

## 👥 User Roles

### Customer
- Register and login
- Browse attractions
- View ticket types and prices
- Book tickets online
- View booking history
- Submit ratings and reviews
- Switch between dark and light mode

### Admin
- Secure admin login
- View dashboard statistics
- Manage attractions
- Manage ticket types and prices
- Manage customer bookings
- Manage customers
- Manage customer reviews
- View revenue and booking statistics

---
## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- JavaScript
- React Router

### Backend
- Python
- FastAPI
- REST API
- JWT Authentication

### Database
- MongoDB

### Development Tools
- Visual Studio Code
- MongoDB Atlas
- Postman
---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
- Python 3.9+ installed
- Node.js (v18+) installed
- MongoDB installed locally or a MongoDB Atlas connection string

---

### 2. Clone the Repository
```bash
git clone [https://github.com/damsaraninawela2002-ux/bluewave-water-park.git](https://github.com/damsaraninawela2002-ux/bluewave-water-park.git)
cd bluewave-water-park

Backend Setup

# Navigate to backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn main:app --reload

The backend runs at `[http://127.0.0.1:8000](http://127.0.0.1:8000)` and the Swagger API documentation is available at `[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)`.

Frontend Setup

# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node packages
npm install

# Start the development server
npm run dev
The frontend application runs at http://localhost:5173

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
