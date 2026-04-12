# DawaaLink - Smart Pharmacy Swap & Inventory Management

DawaaLink is a high-performance, security-hardened pharmacy management platform designed to eliminate pharmaceutical waste. It connects pharmacies to facilitate the swapping of near-expiry medications and dead stock in a secure, efficient, and role-based environment.

---

## 🚀 Key Features

### 🛡️ Security First (Adversarial Hardened)
- **Eliminated IDOR:** Identity is strictly derived from JWT principals via `SecurityContextUtil`. No user-controlled ID headers.
- **BCrypt Protected PINs:** Delivery verification PINs are hashed and protected with a 5-attempt lockout threshold.
- **RBAC:** Strict Role-Based Access Control (ADMIN, OWNER, PHARMACIST, EMPLOYEE).
- **Non-Root Containers:** Backend and Frontend containers run as non-privileged users.
- **Secrets Management:** Fully externalized configuration following the 12-factor app methodology.

### ⚡ Performance Optimized
- **O(n+m) Matching Engine:** Optimized trade-matching logic using GTIN-indexed HashMaps, replacing inefficient nested loops.
- **N+1 Query Prevention:** Batch operations utilize `@EntityGraph` for single-query data fetching.
- **Non-blocking WS:** WebSocket-based real-time match notifications and system alerts.

### 📦 Scalable Architecture
- **Backend:** Spring Boot 3.x, Hibernate/JPA, Flyway migrations, PostgreSQL.
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Zustand.
- **Infra:** Dockerized multi-stage builds with Nginx security headers.

---

## 🛠️ Setup & Execution

### 1. Prerequisites
- Docker & Docker Compose
- Node.js (for local frontend development, optional)
- Java 17+ (for local backend development, optional)

### 2. Environment Configuration
Copy the template and fill in your secrets:
```bash
cp .env.example .env
```
Ensure the following variables are set in `.env`:
- `JWT_SECRET`: A secure 256-bit+ string.
- `POSTGRES_PASSWORD`: Your database password.
- `SPRING_PROFILES_ACTIVE`: Set to `dev` for Swagger access.

### 3. Launch the Stack
Run the entire platform with a single command:
```bash
docker-compose up -d --build
```

### 4. Access the Application
- **Frontend Dashboard:** [http://localhost](http://localhost) (mapped to port 80)
- **API Documentation (Dev):** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 🏗️ Project Structure

```text
├── backend/            # Spring Boot Application
│   ├── src/main/java   # Clean architecture (Controller, Service, Repository, DTO)
│   └── Dockerfile      # Non-root multi-stage Maven build
├── frontend/           # Vite + React Application
│   ├── src/features    # Domain-driven feature modules
│   ├── src/components  # Shared UI components
│   └── Dockerfile      # Nginx hardened with security headers
└── docker-compose.yml  # Orchestration with externalized secrets
```

---

## 🧪 Testing & Verification

- **Backend:** Run `./mvnw clean test` (requires local environment).
- **Frontend:** Run `npm run build` to verify production-ready assets.
- **Security Audit:** All 20 audit criticalities from the 2026-04 security review have been remediated.

---

## 📄 License
MIT License. See LICENSE for details.
