# Learning Management System (LMS)

Ovo je zajednički završni projekat za predmete:  
- **Internet Softverske Arhitekture (ISA)**  
- **Klijentske Web Aplikacije (KWA)**  
- **Veb Bazirani Informacioni Sistemi (VBIS)**  

Projekat je **Learning Management System** za univerzitet, razvijen prema zadatoj specifikaciji.  

---

## Arhitektura projekta

Arhitektura projekta urađena je u **client–server modelu**.  
Na bekend strani implementiran je **monolit**.

### Backend
- **Framework:** NestJS (TypeScript)  
- **ORM:** Prisma  
- **Baza podataka:** SQLite  
- **Fuseki server:** Docker kontejner sa Apache Jena Fuseki  
  - U skladu sa specifikacijom, jedan entitet je implementiran preko TDB Fusekija.  
  - Izabrali smo entitet **University** (root univerzitet pod nazivom *Harvox*).  
  - Podaci o univerzitetu vraćaju se iz Fuseki servera.

### Frontend
- **Framework:** Next.js (TypeScript)  
- **Stilizacija:** Tailwind CSS  
- **UI biblioteka:** shadcn/ui  

---

## Tim

Ovaj projekat je realizovan u okviru **Tima 18**, koji čine:  
- Kristina Karan (2020271177)  
- Adnan Kapetanović (2020271183)  
- Stefan Mijić (2018271328)  

---

## Organizacija i razvoj

Za organizaciju zadataka koristili smo **Kanban Project Board** na GitHubu.  
Primijenili smo **GitHub Flow** metodologiju razvoja:  
- otvaranje **feature grana** sa `dev` grane  
- spajanje izmjena kroz pull request-ove na `dev`  
- stabilne verzije merge-ovane na `main`  

Na ovaj način obezbijedili smo jasnu podjelu rada, preglednost i kontrolu kvaliteta koda.  


## Pokretanje projekta

klonirati repo
yarn install
yarn dev:server-client
