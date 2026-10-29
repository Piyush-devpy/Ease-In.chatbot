
<div align="center">

# Ease-In

### A Supportive Mental Well-Being Self-Assessment Platform for College Students

[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)](#project-status)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#technology-stack)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#technology-stack)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](#technology-stack)
[![Flask](https://img.shields.io/badge/Backend-Flask-black?style=for-the-badge&logo=flask)](#technology-stack)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](#technology-stack)

</div>

---

## About the Project

**Ease-In** is a web-based, non-diagnostic mental well-being self-assessment chatbot designed to help college students reflect on their mental health and discover appropriate support resources.

The platform provides a conversational interface that guides users through standardized screening questions related to depression and anxiety symptoms. Based on their responses, it calculates assessment scores and provides supportive guidance and possible next steps.

Ease-In aims to encourage early help-seeking behavior and make mental well-being resources easier for students to access.

> **Disclaimer:** Ease-In is not a diagnostic tool and does not replace professional medical advice, diagnosis, or treatment.

## Project Status

| Component | Status |
|---|---|
| Project | Active Development |
| Frontend | React + TypeScript |
| UI Styling | Tailwind CSS |
| Backend | Python + Flask |
| Database | MySQL |
| Assessment Frameworks | PHQ-9 and GAD-7 |
| Supported Languages | English, Hindi and Spanish |
| Deployment | Configuration depends on the target environment |

## Key Features

- **Conversational Assessment:** A chatbot-style interface for answering mental well-being questions.
- **PHQ-9 Screening:** Assesses depressive symptoms using the PHQ-9 questionnaire.
- **GAD-7 Screening:** Assesses anxiety symptoms using the GAD-7 questionnaire.
- **Automated Scoring:** Sends assessment responses to the backend for score calculation.
- **Supportive Guidance:** Displays results, disclaimers and next-step guidance returned by the backend.
- **Multilingual Interface:** Supports English, Hindi and Spanish in the question interface.
- **Privacy-Conscious Experience:** Designed to let users complete assessments without creating an account.
- **Responsive Design:** Tailwind CSS utilities support mobile, tablet and desktop layouts.
- **Feedback System:** Provides a feedback page for collecting user opinions.
- **Multiple Pages:** Includes Home, About, Feedback, Donate and Questions pages.

The actual data collected and stored depends on the current backend implementation and deployment configuration.

## Technology Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
- React Router

### Backend

- Python
- Flask
- REST APIs

### Database

- MySQL
- Aiven MySQL Free Tier for cloud database hosting, when configured

### Development Tools

- Visual Studio Code
- Git and GitHub
- npm
- Python virtual environment

## Project Structure

```text
Ease-In/
|
|-- Backend/
|   |-- routes/
|   |-- .env
|   |-- app.py
|   |-- assessment.py
|   |-- chatbot.py
|   |-- db.py
|   |-- requirements.txt
|
|-- Frontend/
|   |-- public/
|   |-- src/
|   |-- package.json
|   |-- package-lock.json
|   |-- index.html
|   |-- vite.config.ts
|
|-- .gitignore
|-- README.md
```

This is a high-level representation. Your repository may contain additional files and folders.

## Getting Started

Follow these steps to run Ease-In locally.

### Prerequisites

Install the following software:

- Python
- Node.js and npm
- MySQL Server or a configured Aiven MySQL service
- Git (optional)

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Ease-In
```

Replace `<YOUR_REPOSITORY_URL>` with your Git repository URL.

### 2. Set Up the Flask Backend

Open a terminal in the project root:

```powershell
cd Backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If you are using Command Prompt instead of PowerShell, activate the virtual environment with:

```bat
.venv\Scripts\activate
```

### 3. Configure Environment Variables

Create a `.env` file inside the `Backend` directory.

Example configuration:

```env
DB_HOST=your_mysql_host
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
```

**Important:** These are example variable names. Use the exact names expected by your current `Backend/db.py` and application configuration.

Never commit real database credentials to GitHub.

### 4. Configure MySQL

You can use a local MySQL instance or a configured Aiven MySQL database.

1. Ensure the database service is running.
2. Create the database if it does not already exist.
3. Create the required tables using your project's schema or initialization logic.
4. Configure the correct database host, port, username and password.
5. Confirm that your Flask backend can connect to the database.

For Aiven, use the connection details shown in your Aiven Console. Depending on the service configuration, SSL may be required.

**Note:** The exact schema and database initialization commands depend on your current backend implementation.

### 5. Run the Backend

With the virtual environment activated:

```powershell
python app.py
```

Keep this terminal open.

The examples below assume the backend runs at:

```text
http://localhost:5000
```

Use the actual host and port configured by your Flask application if they differ.

### 6. Install Frontend Dependencies

Open a second terminal from the project root:

```bash
cd Frontend
npm install
```

If your frontend uses `VITE_API_BASE_URL`, configure it in `Frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

This example assumes the Flask API is running locally on port 5000.

Do not place database passwords or private secrets in frontend environment variables. Variables prefixed with `VITE_` can be exposed to browser code.

### 7. Run the Frontend

From the `Frontend` directory:

```bash
npm run dev
```

Open the local URL printed by Vite, commonly:

```text
http://localhost:5173
```

## API Documentation

The frontend integrates with the following backend endpoints.

### Fetch Assessment Questions

**Endpoint**

```http
GET /api/chatbot/questions?language=en
```

**Purpose**

Retrieves the assessment introduction, question sections, frequency options, questions and supporting text for the selected language.

Supported language values:

| Code | Language |
|---|---|
| `en` | English |
| `hi` | Hindi |
| `es` | Spanish |

### Submit Assessment Responses

**Endpoint**

```http
POST /api/assessment/score
```

**Example Request Body**

```json
{
  "answers": [0, 1, 2, 1, 0, 1, 2, 0, 1, 1, 0, 2, 1, 0, 1, 2],
  "language": "en"
}
```

The frontend sends 16 ordered answers:

- The first 9 answers correspond to PHQ-9.
- The remaining 7 answers correspond to GAD-7.

The numerical values must match the frequency options defined by the backend.

The scoring endpoint returns assessment results, including PHQ-9 and GAD-7 scores, a self-harm flag, support information, a disclaimer and next-step guidance.

Refer to `Backend/assessment.py` for the authoritative scoring implementation and response format.

## Privacy and Safety

Ease-In is designed to support self-reflection and help users explore available resources. It must not be presented as a diagnostic system.

- Clearly explain that screening results are not a diagnosis.
- Provide appropriate support information when required by the assessment flow.
- Protect database credentials and other secrets.
- Review data retention, access control, logging and hosting configuration before public deployment.
- Do not claim that data is completely anonymous or never stored without verifying the complete application and infrastructure.
- Review applicable privacy and security requirements before collecting real user data.

If a user may be in immediate danger, the application should direct them to appropriate local emergency or crisis support resources.

## Development Workflow

Recommended development practices:

1. Use Git branches for significant changes.
2. Keep backend and frontend configuration documented.
3. Test the question retrieval endpoint after API changes.
4. Verify scoring behavior with appropriate test cases.
5. Test language switching and translated question content.
6. Check mobile, tablet and desktop layouts.
7. Review `git status` before every commit.
8. Keep `.env`, virtual environments and generated files out of version control.

## Troubleshooting

### Frontend Cannot Connect to Flask

- Verify that the Flask server is running.
- Check the configured backend URL.
- Confirm the port number.
- Inspect browser developer tools for request errors.
- Check the Flask terminal for exceptions.

### MySQL Connection Error

- Verify the MySQL service status.
- Check the database host, port, username and database name.
- Confirm that the environment variable names match `Backend/db.py`.
- Verify that the database user has the necessary permissions.
- If using Aiven, check the service status and connection settings.

### `npm run dev` Fails

Run the command from the frontend directory:

```bash
cd Frontend
npm install
npm run dev
```

Confirm that `Frontend/package.json` exists.

### Python Dependencies Are Missing

Activate the backend virtual environment and run:

```powershell
pip install -r requirements.txt
```

If necessary, recreate the virtual environment and reinstall dependencies.

## Future Improvements

Potential improvements for future development include:

- Automated tests for backend endpoints and scoring.
- More comprehensive accessibility testing.
- Improved privacy and data-retention documentation.
- Production deployment configuration.
- Expanded localization and translation review.
- Additional support-resource information.

These items are suggestions for future work, not claims that they are already implemented.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a branch for your change.
3. Implement and test your changes.
4. Commit your work with a descriptive message.
5. Open a pull request explaining the changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details..

---

<div align="center">

**Ease-In — Making Mental Well-Being Support Easier to Approach**

</div>
