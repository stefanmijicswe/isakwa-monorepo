# IsaKwa Server - NestJS Backend

Backend server za IsaKwa aplikaciju izgrađen sa NestJS, Prisma ORM i SQLite bazom.

## ✨ Funkcionalnosti

- 🔐 **Autentifikacija i autorizacija** sa JWT tokenima
- 👥 **Tri korisničke uloge**: Admin, Profesor, Student
- 📊 **Prisma ORM** sa SQLite bazom podataka
- 🛡️ **Role-based access control** (RBAC)
- 📝 **Profili korisnika** specifični za ulogu
- ✅ **Validation** sa class-validator
- 🧪 **Test endpoints** za sve funkcionalnosti

## 🗄️ Struktura baze podataka

### Korisnici (User)
- Osnovni podaci: email, password, ime, prezime, uloga
- Opciono: profesor profil ili student profil

### Profesor profil (ProfessorProfile)  
- Departman, titula, telefon, kancelarija

### Student profil (StudentProfile)
- Index, godina, program, telefon

## 🚀 Pokretanje

```bash
# Instaliranje dependencija
yarn install

# Pokretanje u development modu
yarn start:dev

# Production build
yarn build
yarn start:prod
```

## 🔧 Konfiguracija

Kreirati `.env` fajl:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
```

## 📡 API Endpoints

### Autentifikacija
- `POST /api/auth/register` - Registracija korisnika
- `POST /api/auth/login` - Login korisnika

### Korisnici (zaštićeno)
- `GET /api/users/profile` - Profil trenutnog korisnika
- `GET /api/users` - Svi korisnici (samo admin)
- `GET /api/users/professors` - Lista profesora (samo admin)
- `GET /api/users/students` - Lista studenata (admin i profesor)

### Test endpoints
- `GET /api/test/public` - Javni endpoint
- `GET /api/test/protected` - Zaštićeni (samo ulogovan)
- `GET /api/test/admin-only` - Samo admin
- `GET /api/test/professor-only` - Samo profesor  
- `GET /api/test/student-only` - Samo student
- `GET /api/test/professor-or-admin` - Profesor ili admin

## 🧪 Testiranje

Pokrenuti test script:
```bash
./test-api.ps1      # Kompletan test svih funkcionalnosti
./simple-test.ps1   # Jednostavan test korisnika
```

## 📋 Primer registracije

### Admin
```json
{
  "email": "admin@isakwa.com",
  "password": "admin123", 
  "firstName": "Admin",
  "lastName": "Administrator",
  "role": "ADMIN"
}
```

### Profesor
```json
{
  "email": "profesor@isakwa.com",
  "password": "profesor123",
  "firstName": "Marko", 
  "lastName": "Petrović",
  "role": "PROFESOR",
  "department": "Informatika",
  "title": "Dr",
  "phoneNumber": "+381611234567",
  "officeRoom": "101"
}
```

### Student
```json
{
  "email": "student@isakwa.com",
  "password": "student123",
  "firstName": "Ana",
  "lastName": "Milić", 
  "role": "STUDENT",
  "studentIndex": "SW123-2021",
  "year": 3,
  "program": "Softversko inženjerstvo",
  "phoneNumber": "+381611234568"
}
```

## 🏗️ Arhitektura

- **Prisma ORM** - tipovan ORM za bazu podataka
- **JWT Guards** - autentifikacija sa Bearer tokenima
- **Role Guards** - autorizacija na osnovu uloge
- **DTO Validation** - validacija input podataka
- **Global Exception Filters** - centralizovano rukovanje greškama

## 🔒 Sigurnost

- Passwordi su hash-ovani sa bcrypt
- JWT tokeni imaju expiration
- Role-based access control
- Input validation na svim endpoints
- CORS konfiguracija

## Development

This server is part of a Turborepo monorepo. You can run it alongside the client application using:

```bash
# From the root directory
yarn dev
```

This will start both the client (port 3000) and server (port 3001) in development mode.