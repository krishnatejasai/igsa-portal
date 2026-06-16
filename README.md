# IGSA Portal

Official web portal for the **Indian Graduate Student Association (IGSA)** at the **University of Florida**.

The platform helps students stay connected with IGSA through event registrations, announcements, board information, photo galleries, contact forms, and a dedicated board management dashboard.

---

## Live Website

🌐 https://igsa-portal.vercel.app

---

## Features

### Public Portal

- View upcoming IGSA events
- Register for events online
- Meet the IGSA Board
- Browse event galleries
- View announcements and updates
- Contact the IGSA team
- Fully responsive design for desktop and mobile

### Board Dashboard

- Secure board member login
- Role-based access control
- Create, edit, and manage events
- Registration capacity management
- Open/close event registrations
- View and export student registrations
- QR-based attendance check-in
- Manage announcements
- Manage board members
- Manage gallery albums
- View and manage student inquiries
- Dashboard analytics and event insights

---

## Admin Roles

The portal supports role-based permissions for:

- President
- Vice President
- Treasurer
- Executive Secretary
- IT Director
- Event Director
- Event Manager
- PR Director
- Marketing Manager
- Social Media Manager
- Creative Director
- Board Member

Permissions are automatically enforced throughout the dashboard.

---

## Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### Additional Libraries

- QR Code Generator
- HTML5 QR Scanner
- JSON Web Tokens

---

## Project Structure

```text
igsa-portal
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── config
│   │   └── assets
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Key Features Implemented

### Event Management

- Create events
- Edit events
- Delete events
- Capacity tracking
- Registration control
- Event analytics

### Student Registration System

- Online registration
- Duplicate registration prevention
- Capacity enforcement
- QR code generation
- Registration export

### Attendance Tracking

- QR-based check-in
- Manual check-in support
- Attendance statistics
- Check-in timestamps

### Board Management

- Public board profiles
- Board role management
- Contact information display

### Announcements

- Create announcements
- Edit announcements
- Delete announcements
- Public announcement feed

### Gallery Management

- Create gallery albums
- Upload event photos
- Public gallery display

### Contact System

- Student inquiry form
- Dashboard message management

---

## Installation

### Clone Repository

```bash
git clone https://github.com/krishnatejasai/igsa-portal.git
cd igsa-portal
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Backend Environment Variables

Create a `.env` file inside the backend folder:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Frontend Environment Variables

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=your_backend_url
```

---

## Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- MongoDB Atlas

---

## Screenshots

### Home Page

Add screenshot here

### Events Page

Add screenshot here

### Board Page

Add screenshot here

### Admin Dashboard

Add screenshot here

### QR Check-In

Add screenshot here

---

## Future Enhancements

- Email notifications
- Event reminder system
- Attendance analytics dashboard
- Membership management
- Online payments
- Volunteer management system
- Automated certificate generation

---

## Developed For

**Indian Graduate Student Association (IGSA)**  
**University of Florida**

---

## Author

**Sai Sri Krishna Teja Sanku**

- University of Florida
- M.S. Computer & Information Science & Engineering
- President, IGSA UF

GitHub: https://github.com/krishnatejasai

---

## License

This project is developed for the Indian Graduate Student Association (IGSA) and is intended for student engagement, event management, and community support activities.