# MediLab – Online Lab Test Booking System

MediLab is a complete, modern, user-friendly full-stack web application designed for diagnostic laboratory test discovery, transparent pricing comparison, home sample collection scheduling, live status tracking, and certified medical report downloads.

---

## 🌟 Key Features

1. **Patient-Centric Homepage**
   - Clean, accessible medical design for normal users and seniors
   - Real-time global test search (e.g., search "Thyroid", "CBC", "Lipid", "HbA1c")
   - Simple 3-step booking explanation (Select Test → Choose Date & Time → Confirm Booking)
   - Popular diagnostic packages and high-acuity checkups

2. **Laboratory Tests Catalog**
   - Cards displaying: Test Name, Short Description, Upfront Fee, Sample Type (Blood/Serum/Urine), and Report Delivery Time
   - Category filtering: Blood Tests, Diabetes, Thyroid, Liver, Kidney, Vitamins, Hormones, Full Body Checkups
   - Price sorting (Low to High, High to Low, Most Popular)
   - Fast instant search

3. **Detailed Test Overview**
   - Clinical description, test parameters measured, biological reference intervals
   - Patient preparation instructions (fasting hours, water intake, medication precautions)
   - Sample type requirements and certified lab analyzer methodology

4. **Streamlined 5-Step Booking Flow**
   - **Step 1:** Select Patient (Self or Family Member)
   - **Step 2:** Patient Demographics (Name, Age, Gender, Mobile Phone)
   - **Step 3:** Collection Method (Doorstep Home Sample Collection with address or Direct Laboratory Visit)
   - **Step 4:** Date & Hourly Time Slot Selection (07:00 AM – 06:00 PM)
   - **Step 5:** Transparent Order Summary and Instant Confirmation

5. **Instant Booking Confirmation**
   - Unique Booking Reference ID (e.g. `MLB-72810`)
   - Direct shortcut to live status tracking or immediate booking of another test

6. **Patient Dashboard**
   - Real-time statistics: Total Bookings, Upcoming Tests, Completed Reports, and Cancelled Bookings
   - Clean status badges: `Pending`, `Confirmed`, `Sample Collected`, `Testing`, `Report Ready`, `Completed`, `Cancelled`
   - Booking cancellation option for eligible pending/confirmed orders

7. **Visual 5-Step Progress Tracker**
   - `Booking Confirmed` → `Sample Collection` → `Sample Collected` → `Testing in Lab` → `Report Ready`
   - Responsive horizontal and mobile vertical layouts

8. **Digital Diagnostic Pathology Report**
   - ISO 15189:2022 & NABL accredited lab header layout
   - Patient demographics, collection timestamps, and barcode ID
   - Tabular parameter observed values, reference intervals, and interpretation flags (Normal / High / Low)
   - Digital sign-off by Chief Consulting Pathologist with one-click **Print / Save as PDF** support

9. **User Profile & Family Management**
   - Edit personal demographics, primary phone, default address, date of birth, and gender
   - Add, manage, and remove family members (Spouse, Parents, Children, Siblings) for 1-click booking

10. **Administrator Management Console**
    - **System Metrics:** Total registered users, total bookings, active pending queue, completed reports, and total revenue
    - **Booking Management:** Filter by status, search by booking ID or patient phone, and update testing status (which automatically compiles report parameters upon reaching "Report Ready")
    - **Test Catalog Management:** Add new diagnostic tests, edit descriptions/pricing/availability, or remove obsolete tests
    - **User Directory:** View registered users, lifetime booking frequency, and spend totals

---

## 🛠 Tech Stack

- **Frontend:**
  - React 19
  - Vite
  - Tailwind CSS v4
  - Lucide Icons
  - Fetch API with centralized error abstraction
  - Google Fonts: Plus Jakarta Sans & JetBrains Mono

- **Backend:**
  - Node.js & Express.js
  - RESTful API architecture
  - JWT Authentication (`jsonwebtoken`)
  - Password Hashing with Salt Rounds (`bcryptjs`)
  - Integrated Express API connector inside Vite dev server and standalone `server.ts`

- **Database & Persistence:**
  - MongoDB models schema architecture (`User`, `Test`, `Booking`)
  - Zero-config auto-seeding engine (`data/database.json`) with preloaded test catalog, demo patient, and admin account

---

## 🔑 Preconfigured Demo Accounts

For immediate testing, you can sign in using the 1-click demo buttons on the Sign In page or with the credentials below:

- **Demo Patient Account:**
  - Email: `demo@medilab.com`
  - Password: `User@123`
  - *Has preloaded upcoming & completed bookings, family members, and viewable diagnostic reports.*

- **Administrator Account:**
  - Email: `admin@medilab.com`
  - Password: `Admin@123`
  - *Full access to Admin Console, test catalog pricing updates, and booking status controls.*

---

## 🚀 Running the Project

### 1. Installation
Install all dependencies:
```bash
npm install
```

### 2. Run Development Server
Start the unified full-stack application (runs both frontend and Express backend on port 3000):
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
To generate the optimized production build:
```bash
npm run build
```

### 4. Run Full-Stack Production Server
To run the standalone Node.js + Express server serving the production build:
```bash
npm run start
# or: npx tsx server.ts
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create patient account
- `POST /api/auth/login` - Authenticate and issue JWT
- `GET /api/auth/me` - Retrieve current session profile

### Diagnostic Tests
- `GET /api/tests` - Fetch test catalog (with `category`, `search`, `sort` query params)
- `GET /api/tests/:id` - Fetch single test details and parameters
- `POST /api/tests` - Create test (Admin only)
- `PUT /api/tests/:id` - Update test (Admin only)
- `DELETE /api/tests/:id` - Delete test (Admin only)

### Bookings
- `POST /api/bookings` - Submit test booking
- `GET /api/bookings` - Retrieve user bookings (or all bookings if Admin)
- `GET /api/bookings/:id` - Retrieve single booking with report data
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### User Profile & Admin
- `GET /api/users/profile` - Fetch current user profile & family members
- `PUT /api/users/profile` - Update profile & family members
- `GET /api/admin/stats` - Retrieve aggregate business & booking metrics (Admin only)
- `GET /api/admin/users` - Retrieve patient registry with booking counts (Admin only)
