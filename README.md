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
