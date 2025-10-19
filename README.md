# HealthMate AI - Sehat ka Smart Dost 🏥🤖

A personal health companion web application that uses AI to analyze medical reports and track health vitals. Get AI-powered insights in both English and Roman Urdu.

## 🚀 Features

- **Medical Report Analysis**: Upload medical reports (PDF/Images) and get AI-generated explanations
- **Bilingual AI Support**: AI summaries in both English and Roman Urdu
- **Health Vitals Tracking**: Track BP, blood sugar, weight, pulse, and more
- **Health Insights**: Get personalized AI-powered health recommendations
- **Data Visualization**: View health trends and statistics with interactive charts
- **Secure Authentication**: JWT-based user authentication system
- **Cloud Storage**: Reports stored securely on Cloudinary

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for file storage
- **Google Gemini AI** for report analysis
- **Multer** for file uploads
- **PDF-Parse** for PDF text extraction
- **Sharp** for image processing

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Axios** for API calls
- **React Router** for routing
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📁 Project Structure

```
HEALTHMATE_AI/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── uploadController.js
│   │   ├── aiController.js
│   │   └── vitalsController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Report.js
│   │   └── Vital.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── aiRoutes.js
│   │   └── vitalsRoutes.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Upload/
│   │   │   └── ...
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Google Gemini AI API key

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your credentials:
   ```env
   PORT=5000
   ORIGIN=http://localhost:5173
   MONGO_URI=mongodb://localhost:27017/healthmate_ai
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```env
   VITE_BASE_URL=http://localhost:5000
   VITE_APP_NAME=HealthMate AI
   VITE_APP_TAGLINE=Sehat ka Smart Dost
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📡 API Documentation

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Upload Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload medical report |
| GET | `/api/upload/reports` | Get user's reports |
| DELETE | `/api/upload/reports/:reportId` | Delete specific report |

### AI Analysis Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze/report/:reportId` | Analyze uploaded report |
| GET | `/api/analyze/insights` | Get health insights |

### Vitals Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vitals` | Add vital reading |
| GET | `/api/vitals` | Get user's vitals |
| GET | `/api/vitals/stats` | Get vital statistics |
| PUT | `/api/vitals/:vitalId` | Update vital reading |
| DELETE | `/api/vitals/:vitalId` | Delete vital reading |

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update user profile |

## 📝 API Request/Response Examples

### Upload Medical Report
```javascript
// POST /api/upload
// Headers: Authorization: Bearer <token>
// Body: FormData with 'report' file

Response:
{
  "success": true,
  "message": "Report uploaded successfully",
  "data": {
    "reportId": "64f5a1b2c3d4e5f6a7b8c9d0",
    "fileName": "blood_test.pdf",
    "fileUrl": "https://res.cloudinary.com/...",
    "fileType": "pdf",
    "uploadedAt": "2023-10-18T10:30:00.000Z"
  }
}
```

### Analyze Report
```javascript
// POST /api/analyze/report/:reportId
// Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Report analyzed successfully",
  "data": {
    "reportId": "64f5a1b2c3d4e5f6a7b8c9d0",
    "aiSummaryEn": "Your blood test shows normal values for most parameters...",
    "aiSummaryUr": "Aapka blood test zyada tar cheezon mein normal hai...",
    "analysisStatus": "completed"
  }
}
```

### Add Vital Reading
```javascript
// POST /api/vitals
// Headers: Authorization: Bearer <token>
// Body:
{
  "systolic": 120,
  "diastolic": 80,
  "bloodSugar": 95,
  "sugarType": "fasting",
  "weight": 70.5,
  "pulse": 72,
  "notes": "Feeling good today"
}

Response:
{
  "success": true,
  "message": "Vital signs recorded successfully",
  "data": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "userId": "64f5a1b2c3d4e5f6a7b8c9d1",
    "systolic": 120,
    "diastolic": 80,
    "bloodSugar": 95,
    "weight": 70.5,
    "pulse": 72,
    "recordedAt": "2023-10-18T10:30:00.000Z"
  }
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🎨 Frontend Pages

1. **Landing Page** (`/`) - Introduction to HealthMate AI
2. **Login/Register** (`/login`, `/signup`) - User authentication
3. **Dashboard** (`/dashboard`) - Overview of health data
4. **Upload Report** (`/upload`) - Upload and analyze medical reports
5. **Vitals Tracker** (`/vitals`) - Track health vitals
6. **AI Insights** (`/insights`) - Personalized health insights
7. **Reports History** (`/reports`) - View all uploaded reports
8. **Health Trends** (`/trends`) - Visualize health data trends

## 🚨 Important Notes

### Medical Disclaimer
HealthMate AI provides AI-generated insights for informational purposes only. This application should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.

### Data Privacy
- All medical reports are stored securely on Cloudinary
- User data is encrypted and protected
- No medical data is shared with third parties

### File Limitations
- Supported formats: PDF, JPEG, PNG
- Maximum file size: 10MB
- AI analysis works best with clear, legible reports

## 🐛 Troubleshooting

### Common Issues

1. **AI Analysis Fails**:
   - Check Gemini API key is valid
   - Ensure report text is readable
   - Verify internet connection

2. **File Upload Issues**:
   - Check Cloudinary credentials
   - Verify file size and format
   - Ensure proper authentication

3. **Database Connection**:
   - Verify MongoDB is running
   - Check connection string in .env
   - Ensure database permissions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Developer

**Saad** - Full Stack Developer

---

**HealthMate AI - Sehat ka Smart Dost** 🏥✨

*Making healthcare accessible through AI-powered insights*