# Joe's Running Club 🏃‍♂️

## Om Projektet

Joe's Running Club er en netværksapplikation og platform, der understøtter håndtering af løb i samarbejde med løbeklubber. Platformen muliggør administration af rabatkoder, hvor medlemmer kan tilmelde sig forskellige løb, og administratorer kan sende Joe & The Juice rabatkoder til de fremmødte løbere.

### Funktioner

- 👤 **Brugerregistrering og login**
- 🏃 **Tilmelding til løb**
- 📧 **Emailbekræftelser via Gmail**
- 💰 **Rabatkoder til løb via Gmail**
- 👨‍💼 **Admin dashboard til:**
  - Håndtering af løb
  - Rabatkodeadministration
  - Tilmeldingsoversigt

---

## Installation

### Forudsætninger

- **Node.js**
- **MySQL database**
- **Gmail-konto** til emails

### Trin 1: Kloning af repository

git clone [repository-url]
cd [projekt-mappe]

### Trin 2: Installation af dependencies

npm install

### Trin 3: Opsætning af .env fil

Omdøb `.env.exapmle` til`.env` fil i roden af projektet og indsæt variablerne:

#### Database konfiguration

DB_HOST=din-host
DB_USER=din-bruger
DB_PASSWORD=dit-password
DB_NAME=din-database
DB_PORT=3306

#### Email konfiguration (Gmail)

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=din-email@gmail.com
EMAIL_PASSWORD=din-app-password

#### JWT konfiguration

JWT_SECRET=din-hemmelige-nøgle

### Trin 4: Databaseopsætning

Kør SQL-kommandoerne som findes i `database.sql` for at oprette de nødvendige tabeller på din SQL-database.

### Trin 5: Start serveren

npm start

---

### Gmail Opsætning

For at bruge Gmail til at sende emails:

1. Generér en **App-adgangskode**.
2. Brug denne adgangskode i `.env`-filen.

---

### Database Struktur

- **Users**: Brugerdata og autentificering
- **Runs**: Information om løb
- **Registrations**: Løbstilmeldinger
- **Discounts**: Rabatkoder
- **UserDiscounts**: Rabatkoder til brugere (many-to-many)

---

## API Endpoints

### Offentlig Route

- **GET `/`**  
  Kræver ikke autentifikation. Viser et udkast af de oprettede løb.

### Private Routes

- **GET `/registrations`**  
  Kræver autentifikation. Returnerer en liste over brugerens egne tilmeldinger.
- **GET `/runs`**  
  Kræver autentifikation. Returnerer en liste over alle løb.
- **GET `/runs/:id`**  
  Kræver autentifikation. Returnerer detaljer om et specifikt løb baseret på dets ID.
- **POST `/runs/:id/register`**  
  Kræver autentifikation. Tilmeld en bruger til et specifikt løb baseret på dets ID.

### Login Routes

- **GET `/login`**  
  Viser login-siden.
- **POST `/login`**  
  Håndterer login af en bruger.

### Register Routes

- **GET `/register`**  
  Viser registreringssiden.
- **POST `/register`**  
  Opretter en ny bruger.

### Logout Route

- **GET `/logout`**  
  Logger brugeren ud af systemet.

### Admin Routes

- **GET `/admin`**  
  Viser administrator-dashboardet.
- **GET `/admin/runs/create`**  
  Viser en side til at oprette nye løb.
- **POST `/admin/runs/create`**  
  Opretter et nyt løb.
- **POST `/admin/runs/:id/delete`**  
  Sletter et specifikt løb baseret på dets ID.
- **POST `/admin/runs/:id/edit`**  
  Redigerer et specifikt løb baseret på dets ID.
- **POST `/admin/discounts/create`**  
  Opretter en ny rabatkode.
- **POST `/admin/discounts/:id/delete`**  
  Sletter en specifik rabatkode baseret på dens ID.
- **POST `/admin/discounts/:id/status`**  
  Opdaterer status for en specifik rabatkode baseret på dens ID.

### Bemærk

- Alle private og admin-ruter kræver autentificering af brugeren.
- Administratorruter kræver yderligere autorisation for adgang.

---

## Teknologier

- **Node.js** som runtime environment
- **Express.js** som web framework
- **MySQL** som database system
- **mysql12** som MySQL driver/client
- **EJS templates** (Embedded JavaScript) som template engine
- **Nodemailer** til email funktionalitet
- **Bcrypt** til password hashing
- **JWT** til authentication/session håndtering
- **cookie-parser** til cookie håndtering
- **body-parser** til request parsing

---

## Udviklere

- **Malou Lüthcke**
- **Josephine Holst-Christensen**
- **Thomas Studstrup**
- **Mads Pedersen**
