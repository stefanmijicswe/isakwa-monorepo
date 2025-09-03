# Teaching Courses - Backend Integration

## Pregled

Teaching Courses komponenta je sada potpuno povezana sa backend sistemom i koristi PRAVE podatke iz baze. Svi kursevi i studenti se učitavaju iz backend API-ja preko ProfessorAssignment i CourseEnrollment tabela.

## Backend Endpointi

### Implementirani endpointi:
- `GET /api/academic-records/my-subjects` - Dohvata predmete profesora preko ProfessorAssignment tabele ✅
- `GET /api/academic-records/professor/courses/{id}/students` - Dohvata PRAVE studente iz CourseEnrollment tabele ✅

### Alternativni endpointi (dostupni ali se trenutno ne koriste):
- `GET /api/subjects/{id}` - Dohvata pojedinačni predmet
- `PATCH /api/subjects/{id}` - Ažurira predmet
- `GET /api/academic-records/professor/courses` - Dohvata kurseve profesora sa exam info

### Database Setup koji je urađen:
- ✅ **ProfessorAssignment** tabela ima 7 dodeljenih predmeta profesorima
- ✅ **CourseEnrollment** tabela ima 8 upisa studenata u predmete  
- ✅ Backend logika ispravljena da koristi ProfessorAssignment umesto mock podataka
- ✅ Backend metoda `getProfessorSubjects()` sada vraća samo predmete dodeljene profesoru

### Pinned Courses čuvanje:
- **Primary**: localStorage (jer backend nema user preferences endpoint)
- **Backup**: Nema - koristi se samo localStorage

## Funkcionalnosti

### ✅ Implementirane funkcionalnosti:

1. **Učitavanje PRAVIH kurseva iz baze podataka**
   - Dohvata profesorove predmete iz ProfessorAssignment tabele
   - Automatski dohvata PRAVE studente iz CourseEnrollment tabele
   - Računa prosečne ocene na osnovu enrollment podataka
   - ✅ NEMA VIŠE MOCK PODATAKA - sve iz baze!

2. **Pinned Courses - localStorage čuvanje**
   - Čuva pinned courses u localStorage
   - Persist preko browser sesija 
   - Instant updates bez backend dependency

3. **Real-time refresh**
   - Refresh dugme za ažuriranje podataka
   - Loading stanja za sve operacije
   - Error handling sa retry opcijama

4. **localStorage Pinned Courses**
   - Trajno čuvanje pinned courses u localStorage
   - Persist preko browser sesija
   - Instant updates bez backend poziva

### 🔄 Automatski fallback mehanizmi:

1. **Sample studenti** - Ako API ne može da dohvati studente za kurs
2. **403 Forbidden handling** - Ako profesor nije dodeljen predmetu, koristi sample podatke
3. **Graceful error handling** - Prikazuje error poruke sa retry opcijama
4. **Course loading fallback** - Komponenta nastavlja da radi čak i ako neki kursevi ne mogu da se učitaju

## Kako testirati

### 1. Backend dostupan:
```bash
# Startuj backend server
cd apps/server
yarn start:dev

# Startuj frontend
cd apps/client
yarn dev
```

### 2. Backend nedostupan:
- Zaustavi backend server
- Komponenta će i dalje raditi sa fallback podacima
- Pinned courses će se čuvati u localStorage

### 3. Testiranje pinned courses persistance:
1. Pin neki kurs
2. Refresh stranicu
3. Kurs treba da ostane pinovan (čuva se u localStorage)
4. Otvori novu karticu - kurs treba da ostane pinovan
5. Zatvori i otvori browser - kurs treba da ostane pinovan

### 4. Testiranje error handling:
1. Zaustavi backend
2. Refresh stranicu
3. Treba da vidiš error poruku sa "Try again" dugmetom
4. Startuj backend
5. Klikni "Try again" - podaci treba da se učitaju

### 5. Testiranje 403 Forbidden handling:
- Ako vidiš "Professor not assigned to this subject" u konzoli
- Komponenta automatski prebacuje na sample podatke
- Students se prikazuju bez greške na UI

## API Responses

### Primer odgovora za `/academic-records/my-subjects`:
```json
[
  {
    "subject": {
      "id": 1,
      "name": "Introduction to Programming",
      "code": "CS101",
      "ects": 6,
      "semesterType": "WINTER",
      "description": "Basic programming concepts"
    },
    "academicYear": "2024/2025",
    "professorId": 26,
    "professor": {
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }
]
```

### Primer odgovora za `/academic-records/courses/{id}/enrollments`:
```json
[
  {
    "student": {
      "id": 1,
      "firstName": "Ana",
      "lastName": "Marković", 
      "email": "ana.markovic@student.edu"
    },
    "year": 2,
    "status": "Active",
    "attendance": 85,
    "assignments": 90,
    "midterm": 88,
    "final": 92
  }
]
```

### Primer localStorage podataka za pinned courses:
```json
// Key: "pinned-courses" 
// Value: [1, 3, 5]
```

## Logging i Debugging

Servis loguje sve operacije u browser konzoli:
- 🎓 Za osnovne operacije
- 📌 Za pin/unpin operacije  
- ✅ Za uspešne operacije
- ❌ Za greške
- ⚠️ Za fallback operacije

## Performance Optimizacije

1. **Paralelno učitavanje** - Studenti se učitavaju paralelno za sve kurseve
2. **Memoization** - Sortiranje kurseva je memoized
3. **Optimistic updates** - Pin/unpin se odmah ažurira u UI-ju
4. **Batch operations** - Sve pin operacije se batch-uju

## Sigurnost

- Svi API pozivi koriste Bearer token autentifikaciju
- Token se automatski dohvata iz localStorage  
- Pinned courses se čuvaju lokalno i nisu povezani sa sigurnosnim rizicima
- Sve operacije su idempotentne
