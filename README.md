# 🎫 Smart Queue Management System

A full-stack queue management application built with **Spring Boot**, **MySQL**, and a custom **REST API**, paired with a live vanilla JS/HTML/CSS frontend dashboard.

Manage customer queues, issue tokens, call the next customer, and track status — all in real time.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA |
| Database | MySQL |
| Frontend | HTML5, CSS3, Vanilla JavaScript (no framework) |
| Build Tool | Maven |
| API Style | REST (JSON) |

---

## ✨ Features

- Issue a token to a new customer joining the queue
- Call the next waiting customer automatically
- Update status: `WAITING` → `SERVING` → `COMPLETED` / `CANCELLED`
- View queue filtered by status
- Delete queue entries
- Live-updating dashboard with auto-refresh

---

## 📡 REST API Documentation

Base URL: `http://localhost:8181/api/queue`

### 1. Add a customer to the queue

`POST /api/queue`

**Request Body**
```json
{
  "customerName": "Alice"
}
```

**Response `201 Created`**
```json
{
  "id": 1,
  "customerName": "Alice",
  "tokenNumber": 1,
  "status": "WAITING",
  "createdAt": "2026-07-19T12:00:00"
}
```

---

### 2. Get all queue entries

`GET /api/queue`

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "customerName": "Alice",
    "tokenNumber": 1,
    "status": "WAITING",
    "createdAt": "2026-07-19T12:00:00"
  }
]
```

---

### 3. Get only waiting customers

`GET /api/queue/waiting`

**Response `200 OK`** — same shape as above, filtered to `status: "WAITING"`

---

### 4. Get a single entry by ID

`GET /api/queue/{id}`

**Example:** `GET /api/queue/1`

**Response `200 OK`** (or `404 Not Found` if the ID doesn't exist)

---

### 5. Call the next customer in line

`PUT /api/queue/next`

Marks the earliest `WAITING` entry as `SERVING`.

**Response `200 OK`** — the customer now being served, or `204 No Content` if no one is waiting.

---

### 6. Update the status of an entry

`PUT /api/queue/{id}/status`

**Request Body**
```json
{
  "status": "COMPLETED"
}
```

Valid values: `WAITING`, `SERVING`, `COMPLETED`, `CANCELLED`

**Response `200 OK`** (or `404 Not Found`)

---

### 7. Delete an entry

`DELETE /api/queue/{id}`

**Response `204 No Content`** (or `404 Not Found`)

---

## 📋 API Summary Table

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/queue` | Add a new customer to the queue |
| `GET` | `/api/queue` | Get all queue entries |
| `GET` | `/api/queue/waiting` | Get only customers currently waiting |
| `GET` | `/api/queue/{id}` | Get a single entry by ID |
| `PUT` | `/api/queue/next` | Call the next waiting customer |
| `PUT` | `/api/queue/{id}/status` | Update an entry's status |
| `DELETE` | `/api/queue/{id}` | Delete a queue entry |

---

## 🛠️ Setup & Installation

### Prerequisites
- Java 21+
- Maven
- MySQL Server running locally

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/smart-queue-management-springboot.git
cd smart-queue-management-springboot
```

### 2. Create the MySQL database
```sql
CREATE DATABASE smart_queue_db;
```

### 3. Configure database credentials

Open `src/main/resources/application.properties` and update:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 4. Run the application
```bash
mvn clean install
mvn spring-boot:run
```

### 5. Open in browser
```
http://localhost:8181/
```

The app loads a full dashboard — no separate frontend server needed. The static frontend is served directly by Spring Boot from `src/main/resources/static/`.

---

## 🧪 Testing the API with Postman

A Postman collection is included: [`SmartQueue.postman_collection.json`](./SmartQueue.postman_collection.json)

Import it directly into Postman to test all 7 endpoints without manual setup.

---

## 📁 Project Structure

```
smart-queue-management-springboot/
├── src/
│   └── main/
│       ├── java/smart_queue_management/example/
│       │   ├── RestApiApplication.java
│       │   ├── controller/QueueController.java
│       │   ├── service/QueueService.java
│       │   ├── repository/QueueRepository.java
│       │   └── entity/Queue.java
│       └── resources/
│           ├── application.properties
│           └── static/
│               ├── index.html
│               ├── css/style.css
│               └── js/app.js
├── pom.xml
└── README.md
```

---

## 📄 License

This project is open source and available for personal or educational use.
