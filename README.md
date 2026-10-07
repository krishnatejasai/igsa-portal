# IGSA Portal

Official web portal for the **Indian Graduate Student Association (IGSA)** at the **University of Florida**.

The platform helps students stay connected with IGSA through event registrations, board information, photo galleries, roommate and travel listings, and a dedicated board management dashboard.

---

## Live Website

🌐 https://www.igsauf.us

---

## Features

### Public Portal

- View upcoming IGSA events
- Register for events online
- Meet the IGSA Board
- Browse event galleries
- Find temporary/permanent roommates by location and move-in dates
- Find travel partners by departure city, destination, date, and ride preference
- Publish community listings immediately with public email/phone consent
- Sign in with Google to manage listings across devices
- Edit, close, or delete your listing through My listings or its private link
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
- Manage board members
- Manage gallery albums
- Hide and restore community listings (all authenticated board members)
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

- Editable display order and concise role descriptions

- Public board profiles
- Board role management
- Contact information display



### Gallery Management

- Create gallery albums
- Upload event photos
- Public gallery display

### Contact Links

- Email: igsa.uf@gmail.com
- Instagram and WhatsApp community links

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

## Website maintenance and refinement

- [Website review and prioritized roadmap](docs/WEBSITE_REVIEW.md)
- [Board and gallery editing guide](docs/CONTENT_GUIDE.md)
- Validation tests: `node --test backend/tests/content.test.js`

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
## Community board

Public page: `/community`; account page: `/community/mine`.
Posts publish immediately. Titles are generated internally; cards show the poster's
name and area/route. Travel search has only departure city, destination, and an optional exact date.
Travel posts have one date and no return date. Roommate search has only area/name
and stay type. Roommates can add optional gender and
apartment details. Stay end dates remain optional for roommate posts.

Google sign-in uses Google Identity Services and the official server verification
library. `backend/config/community.js` contains the public OAuth client ID;
`GOOGLE_CLIENT_ID` can override it. Authorized origins must include
`https://www.igsauf.us` and `https://igsauf.us`. Add localhost origins only for local
Google sign-in testing. The Google OAuth app must allow the intended users in its
Audience settings (publish for all users rather than leave it test-user-only).
No client secret, Firebase, SMS, or paid authentication service is required.

Google ID tokens are verified for signature, expiry, issuer, audience, and a
server-signed nonce. The backend issues a seven-day student JWT scoped separately
from board sessions. Google `sub` determines ownership, never a supplied email.
No student passwords are stored. A Google login does not grant board permissions.

Guest posting still works. After publishing, save the private management link;
it permits editing, closing, and permanent deletion. New links are also saved on
that browser under My listings. Anyone using that browser can access saved links.
Students can link an old post to Google by opening its private link, signing in,
and selecting **Link to my Google account**. Matching an email alone never claims
a post. Management secrets and Google owner IDs are excluded from public lists.

All listings remain visible for five calendar months from posting unless closed,
hidden, or deleted. Passed travel dates are clearly labeled. An idempotent startup
migration extends older listings to this policy without reopening closed/hidden
posts. Expiration hides listings from public queries rather than deleting them.
Editing does not reset the five-month period.

Board members can hide/restore or permanently delete any roommate or travel post (with confirmation) at `/admin/community`.
Reports go to `igsa.uf@gmail.com`. Contact details (and any supplied gender/apartment)
are public only after the poster agrees to display them.

Listings are paginated (12 per page). Input is bounded and validated server-side.
Submissions are limited to five per contact per rolling 24 hours; this is a basic
abuse limit rather than verified student identity. Public events, board profiles,
and gallery summaries use a 60-second in-memory cache with request deduplication
and invalidation after successful mutations. Student sessions, private management
responses, and public community contact listings are not cached by this helper.
Free hosting can still have a first-request wake-up delay.

Run checks from the repository root:

```sh
node --test backend/tests/*.test.js frontend/tests/*.test.js
npm --prefix frontend run build
npm --prefix frontend run lint
```

## Registration QR tickets

Students receive their QR ticket on the registration success page and can download
it for event check-in. Registration confirmation emails are not sent.
