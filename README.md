# 🚨 AksiSigap App

An interactive emergency response and alert application featuring a modern React frontend and a Python/Flask backend.

---

## Prerequisites

Make sure you have the following installed on your machine before starting
[Node.js](https://nodejs.org/) (v16 or higher recommended)
[Python](https://www.python.org/) (v3.8 or higher recommended)

---

## How to Run the Application

To run the full application locally, you will need to open two separate terminal window one for the backend API and one for the frontend interface.

---

### 1. Start the Backend (Flask)

Open your first terminal window, navigate to your backend directory, install the required Python dependencies, and start the server:

- Navigate to the backend directory (or your custom folder name)

cd emergency-button-backend

- Install Flask if you haven't already

pip install flask

- (Optional: If you have a requirements file, use: pip install -r requirements.txt)

- Start the Flask backend server

flask run

---

### 2. Start the Frontend (React)

Open a second terminal window, navigate to your frontend directory, install the Node modules, and start the development server

- Navigate to the frontend directory (or your custom folder name)

cd emergency-button

- Install frontend dependencies (only required on your very first run)

npm install

- Start the React development server

npm run dev

---

## Using the App

Once npm run dev finishes loading, your terminal will display a local address (usually http://localhost:5173 or similar). Open that URL in your web browser to use AksiSigap.

Ensure both terminal windows remain open and running simultaneously so the frontend can seamlessly communicate with the backend.
