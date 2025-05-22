# TaskTracker

A simple Task Tracker application with a **React (Next.js)** frontend and **Laravel** backend API.

---

## 🚀 Getting Started

Follow the instructions below to set up the project on your local machine.

---

### 🧾 Prerequisites

Make sure you have the following installed:

- PHP (>= 8.0)
- Composer
- Node.js & npm
- MySQL or compatible database

---

## 📦 Clone the Repository

```bash
git clone https://github.com/Leescifer/TaskTracker.git
cd TaskTracker
```

---

## 💻 Frontend Setup (Next.js)

```bash
cd client
npm install
```

---

## 🛠 Backend Setup (Laravel API)

```bash
cd ../api
composer install
cp .env.example .env
```

### ⚙️ Environment Configuration

Open the `.env` file and update the following:

```env
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 🔑 Generate App Key

```bash
php artisan key:generate
```

### 🗄 Run Migrations

```bash
php artisan migrate
```

### 🚀 Serve the API

```bash
php artisan serve
```

> The Laravel backend will be available at:  
> `http://127.0.0.1:8000`

---

## 📂 Folder Structure

```
TaskTracker/
├── client/   → Next.js frontend
└── api/      → Laravel backend API
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

