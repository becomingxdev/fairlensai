# 🌟 FairLens AI

![FairLens AI Banner](https://img.shields.io/badge/GDG_Solution_Challenge-2026-blue?style=for-the-badge&logo=google) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring) ![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)

**FairLens AI** is an intelligent, automated bias-detection platform designed to analyze historical and current hiring datasets. Built for the **GDG Solution Challenge**, FairLens AI aims to empower HR teams and organizations to identify, quantify, and eliminate unconscious biases in their recruitment processes.

### 🌍 UN Sustainable Development Goals (SDGs) Addressed
Our project directly contributes to the following UN SDGs:
- **Goal 5: Gender Equality** – By identifying and mitigating gender-based disparities in candidate selection.
- **Goal 8: Decent Work and Economic Growth** – By promoting inclusive hiring practices that ensure equal opportunities for all.
- **Goal 10: Reduced Inequalities** – By helping organizations recognize and address biases related to age, region, and background.

---

## ✨ Features

- **📊 Bias Detection Dashboard:** Upload recruitment data and instantly visualize fairness metrics across different demographic groups.
- **🔐 Secure Authentication:** Seamless and secure login using Firebase Authentication.
- **☁️ Cloud-Native Architecture:** Highly scalable backend hosted on Google Cloud Run with a PostgreSQL database.
- **📈 Real-Time Analytics:** Interactive charts and reports built with Recharts and Framer Motion for a smooth user experience.

---

## 🛠️ Technology Stack

**Frontend:**
- React 19, Vite, TypeScript
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- Recharts (Data Visualization)

**Backend:**
- Java 17, Spring Boot 3
- Spring Security + Firebase Admin SDK (JWT Verification)
- PostgreSQL (via Neon.tech)

**Deployment:**
- Frontend: Firebase Hosting
- Backend: Google Cloud Run

---

## 📂 Using the Sample Datasets

We have included two sample datasets in the root directory to help you quickly test the platform's capabilities:

### 1. `sample_hiring_data.csv`
A simple dataset containing basic demographic and qualification data along with the final hiring decision. 
**Columns:** `gender`, `age`, `region`, `qualification`, `selected / rejected`

### 2. `test.csv`
A slightly more detailed dataset simulating a corporate applicant tracking system (ATS) export.
**Columns:** `Candidate_ID`, `Gender`, `Age`, `Years_Experience`, `Qualification`, `Region`, `Hiring_Decision` (1 = Selected, 0 = Rejected)

### 💡 How to use them:
1. Log in to the FairLens AI dashboard.
2. Navigate to the **Upload Data** / **New Audit** section.
3. Drag and drop either `sample_hiring_data.csv` or `test.csv`.
4. Select the gender as "Protected Parameter" and Select/Rejected column as "Decision Parameter".
5. Click **Analyze**. The platform will process the CSV, evaluate the selection rates across different groups (e.g., Male vs. Female, different Age groups, or Regions), and generate a fairness report.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Java 17+
- Maven
- A Firebase Project (with Auth enabled)
- A PostgreSQL Database

### 1. Clone the repository
```bash
git clone https://github.com/becomingxdev/fairlensai.git
cd fairlensai
```

### 2. Run the Backend
Navigate to the `backend` folder, configure your database and Firebase Admin SDK credentials, and start the Spring Boot app:
```bash
cd backend
# Set up application.properties or ENV vars with your DB and Firebase credentials
mvn spring-boot:run
```

### 3. Run the Frontend
Navigate to the `frontend` folder, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```

For production deployment instructions, please refer to our [Deployment Guide](DEPLOY.md).

---

## 🔮 Future Improvements

As we continue to develop FairLens AI beyond the initial MVP, we plan to implement the following features:

1. **🧠 Advanced ML Models:** Integrate TensorFlow or Google Cloud AI to predict bias *before* a decision is made and suggest actionable corrections to recruiters.
2. **📝 Job Description Analyzer:** A tool to scan job postings for biased or non-inclusive language (e.g., overly aggressive jargon) and suggest neutral alternatives.
3. **🔗 ATS Integrations:** Build direct API integrations with popular Applicant Tracking Systems (Workday, Greenhouse, Lever) to analyze data in real-time without requiring manual CSV uploads.
4. **🔔 Automated Alerts:** Set up continuous monitoring that triggers an alert to HR leadership if a sudden spike in demographic disparity is detected in ongoing recruitment pipelines.
5. **🌐 Multi-language Support:** Expand the platform's reach by supporting multiple languages and region-specific diversity metrics.

---

*Built with ❤️ for the GDG Solution Challenge.*
