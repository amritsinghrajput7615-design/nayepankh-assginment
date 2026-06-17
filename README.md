# Volunteer Management System - NayePankh Foundation

An end-to-end web application designed for the **NayePankh Foundation** to manage volunteer applications. Volunteers can register, log in, and view their application status. Administrators can review profiles, search/filter volunteer lists by skills/interests/status, and select or reject applicants with immediate database updates and automated email notifications.

---

## 🚀 Key Features

### 1. Volunteer Portal & Application Dashboard
- **Profile Registration & Authentication**: Detailed onboarding where volunteers specify resident information, phone details, core skills, and social interests.
- **Application Status Dashboard**: Accessible immediately after logging in successfully. Shows a visual stepper progress bar (`Submitted` -> `Under Review` -> `Decision Made`) alongside clean, color-coded state cards:
  - **Pending Review** (Yellow Card): "Your application has been received and is currently under review by the NayePankh Foundation team."
  - **Selected** (Green Card + Congratulation Banner): "Congratulations! You have been selected as a volunteer. Our team will contact you shortly with further details."
  - **Not Selected** (Red Card): "Thank you for your interest in volunteering. Unfortunately, your application was not selected at this time."

### 2. Admin Dashboard & Ecosystem Controls
- **Volunteer Directory**: Full index of registered volunteers displaying name, email, phone, and status badges.
- **Search & Advanced Filtering**: Admins can query by name, email, or phone number, and filter by skills, social interests, or application status (Pending, Selected, Rejected).
- **Application Evaluation Panel**: Inside any volunteer's detail profile, admins can directly change the application status. DB saves occur instantly.
- **Automated SMTP Email Notifications**: Changes in volunteer status dispatch emails immediately via Nodemailer:
  - Selected volunteers receive a congrats message.
  - Rejected candidates receive a thank-you message.

### 3. Centralized API Architecture
- central global configurations define `API_BASE_URL` in a single location (`frontend/src/config/api.js`).
- All frontend components route HTTP requests through a central Axios client instance.

---

## 🛠️ Technology Stack

- **Frontend Core**: React (Vite environment)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Client**: Axios (with global interceptors for JWT injection)
- **Backend Server**: Node.js & Express
- **Database**: MongoDB (via Mongoose)
- **Email Server Integration**: Nodemailer (SMTP transporter configuration)

---

## 📁 Repository Structure

```
nayepankh_assignment/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB Connection setups
│   │   ├── controllers/     # Authentication & Status change handlers
│   │   ├── middleware/      # JWT verify & Admin checks
│   │   ├── models/          # Mongoose Schemas (Volunteer, Admin)
│   │   └── routes/          # Express route paths (prefixed under /api)
│   ├── server.js            # Node startup entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navigation bar, Sidebar, Confirm modal dialogs
│   │   ├── config/          # Global api.js backend base URL definitions
│   │   ├── context/         # AuthContext & ToastContext providers
│   │   ├── pages/           # Dashboard screens, Profile listings, login/registration
│   │   ├── services/        # Centralized Axios API client instance
│   │   ├── App.jsx          # Route handlers & protection mappings
│   │   └── main.jsx
│   ├── vite.config.js       # Vite build configurations & proxy routing
│   └── package.json
└── README.md                # General system documentation
```

---

## ⚙️ Getting Started & Installation

Follow these steps to run both the backend server and frontend client locally:

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend` folder and configure the following:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/nayepankh  # Or your MongoDB atlas connection URI
   JWT_SECRET=your_super_secret_jwt_key
   EMAIL=your_gmail_address@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password        # Gmail 16-character App Password
   ```
4. Start the backend development server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your backend target in the centralized API config file `frontend/src/config/api.js`:
   ```javascript
   export const API_BASE_URL = "http://localhost:3000/api";
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

Open your browser and navigate to `http://localhost:5173` to test the application!

---

## 🔐 Credentials for Testing

- **Default Admin Account**:
  - Email: `admin@nayepankh.org` (or register a custom admin account)
  - Password: `admin123`
