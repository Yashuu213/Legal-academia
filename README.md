# ⚖️ Legal Academia - Smart Law Education Platform

> **A comprehensive EdTech platform connecting Law Students with Premium Notes, Expert Mentorship, and AI-Powered Assistance.**

![Project Banner](https://via.placeholder.com/1200x400?text=Legal+Academia+Platform+Banner) *add your banner here*

## 🚀 Project Overview

**Legal Academia** is a dual-interface web application designed to simplify legal education. It bridges the gap between students needing quality resources and mentors providing guidance.
The platform features a robust **AI-Verification System** for payments, ensuring only legitimate transaction receipts (UPI, Bank Transfer) unlock premium content, filtering out spam/fake uploads automatically.

### 🌟 Key Features

#### 🎓 For Students (`/student-app`)
- **Note Marketplace**: Browse and search categorised legal notes (Constitution, IPC, Torts, etc.).
- **Smart Purchase Flow**: 
  - Upload payment screenshots directly.
  - **Instant AI Verification**: If the receipt is valid (UTR + Amount + Success), access is granted automatically in many cases (or sent for rapid admin approval).
- **Mentorship Booking**: Request 1:1 sessions with legal experts.
- **Real-Time Chat**: Chat with mentors/admins for doubt clearing (Socket.io).
- **Secure File Access**: View purchased PDFs securely in-browser.

#### 🛡️ For Admins (`/admin-app`)
- **Command Center**: Dashboard to view total users, notes, and revenue.
- **AI-Assisted Request Management**:
  - **Verified Tab**: Requests cleared by AI (High Confidence).
  - **Doubtful Tab ⚠️**: Suspicious uploads (Selfies, Random images, Fake receipts) flagged by AI for manual review.
- **Content Management**: Upload and manage PDF notes and categories.
- **User Management**: Oversee student and mentor accounts.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **AI Engine** | **Google Gemini 1.5 Pro/Flash** (Multimodal Vision API) |
| **Real-time** | Socket.io (Bi-directional communication) |
| **Storage** | Multer (Local/Cloud), PDF Handling |
| **Security** | JWT Authentication, BCrypt Hashing, CORS |

---

## 🤖 AI Integration (Gemini 1.5)

We utilize the **Google Gemini Generative AI** model to automate administrative overhead.

### 1. Payment Proof Analysis
- **Model**: `gemini-1.5-flash` (Optimized for speed & cost)
- **Logic**: Inspects uploaded screenshots for:
  - ✅ **Transaction ID / UTR** (Critical)
  - ✅ **Amount** (Numeric Validation)
  - ✅ **Success Status** (Green Tick / "Paid")
- **Outcome**: 
  - If valid -> Auto-tags as `Verified`.
  - If invalid (e.g., selfie, logo) -> Tags as `Doubtful` with confidence score `0%`.

---

## 📂 Project Structure

```bash
Legal-academia/
├── server/             # Node.js Express Backend
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API Endpoints
│   ├── utils/          # AI Service & Helpers
│   └── uploads/        # Stored Files
├── admin-app/          # Admin Dashboard (React)
│   ├── src/pages/      # Request & Content Management
│   └── src/components/ # Reusable UI
└── student-app/        # Student Portal (React)
    ├── src/pages/      # Marketplace & Profile
    └── src/components/ # Chat & Note Viewer
```

---

## ⚡ Getting Started (Local Development)

### Prerequisites
- Node.js (v16+)
- MongoDB URI (Atlas or Local)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/Yashuu213/Legal-academia.git
cd Legal-academia
```

### 2. Setup Backend
```bash
cd server
npm install
# Create a .env file
echo "PORT=5000" >> .env
echo "MONGO_URI=your_mongodb_connection_string" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env
echo "GEMINI_API_KEY=your_gemini_api_key" >> .env
npm start
```

### 3. Setup Frontend (Admin & Student)
Open two new terminals:

**Admin App:**
```bash
cd admin-app
npm install
npm run dev
```

**Student App:**
```bash
cd student-app
npm install
npm run dev
```

---

## 🔒 Environment Variables

**Do NOT commit your `.env` file.**
Create a `.env` in `/server` with the following keys:

- `PORT`: 5000
- `MONGO_URI`: MongoDB Connection String
- `JWT_SECRET`: Secret key for token generation
- `GEMINI_API_KEY`: API Key from Google AI Studio

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

> Built with ❤️ by [Yashuu213](https://github.com/Yashuu213)
