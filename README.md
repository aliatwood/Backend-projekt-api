# Projektuppgift - API
Detta repository innehåller kod för ett REST API byggt med Express och SQLite.  
APIet är byggt för att hantera en restaurangs meny och bordsbokning, samt användarkonton med registrering och inloggning med JWT.  
Lösenord lagras säkert i databasen genom hashing med bcrypt.

## Länk
En liveversion av APIet finns tillgänglig på följande URL: https://backend-projekt-api-qkmv.onrender.com/

## Installation och databas
APIet använder en SQLite-databas. Klona ner källkodsfilerna och följ stegen nedan:
1. Kör `npm install && npm rebuild better-sqlite3` för att installera nödvändiga paket  
2. Skapa en `.env`-fil i rotkatalogen med följande innehåll:
JWT_SECRET=din_hemliga_nyckel  
PORT=3000
3. Starta servern med `node server.js`

### Databasstruktur
| Tabell | Fält |
|---|---|
| users | id (INTEGER, PRIMARY KEY), username (TEXT), password (TEXT), created_at (DATETIME) |
| menu | id (INTEGER, PRIMARY KEY), name (TEXT), description (TEXT), price (REAL), category (TEXT), created_at (DATETIME) |
| bookings | id (INTEGER, PRIMARY KEY), name (TEXT), phone (TEXT), date (TEXT), guests (INTEGER), created_at (DATETIME) |

## Användning
Nedan beskrivs hur man når APIet:

| Metod | Ändpunkt | Beskrivning |
|---|---|---|
| POST | /api/auth/register | Skapar ett nytt användarkonto |
| POST | /api/auth/login | Loggar in användare och returnerar JWT |
| GET | /api/auth/protected | Hämtar skyddad data (kräver giltig JWT) |
| GET | /api/menu | Hämtar alla meny-rätter |
| GET | /api/menu/:id | Hämtar en specifik rätt |
| POST | /api/menu | Skapar en ny rätt (kräver giltig JWT) |
| PUT | /api/menu/:id | Uppdaterar en rätt (kräver giltig JWT) |
| DELETE | /api/menu/:id | Raderar en rätt (kräver giltig JWT) |
| POST | /api/bookings | Skapar en ny bokning |
| GET | /api/bookings | Hämtar alla bokningar (kräver giltig JWT) |
| DELETE | /api/bookings/:id | Raderar en bokning (kräver giltig JWT) |

### Exempel på objekt
Ett menyobjekt sparas i databasen med följande struktur:
```json
{
  "name": "Margherita",
  "description": "Klassisk pizza med tomatsås och mozzarella",
  "price": 129,
  "category": "Pizza"
}
```

Ett bokningsobjekt sparas i databasen med följande struktur:
```json
{
  "name": "Ali Atwood",
  "phone": "070-1234567",
  "date": "2025-12-24",
  "guests": 4
}
```
