// importerar express
const express = require("express");

// importerar databasen
const db = require("../database/db");

// importerar auth-middleware
const authMiddleware = require("../middleware/authMiddleware");

// skapar en router
const router = express.Router();

// route för att skapa en bokning
router.post("/", (req, res) => {

    // hämtar data från request body
    const { name, phone, date, guests } = req.body;

    // om något saknas, skicka 400
    if (!name || !phone || !date || !guests) {
        return res.status(400).json({ message: "Input saknas" });
    }

    // sparar bokningen i databasen
    db.prepare("INSERT INTO bookings (name, phone, date, guests) VALUES (?, ?, ?, ?)").run(name, phone, date, guests);

    // skickar tillbaka bekräftelse
    res.status(201).json({ message: "Bokning skapad" });
});

// route för att hämta alla bokningar, behöver login
router.get("/", authMiddleware, (req, res) => {
    
    // hämtar alla bokningar från databasen
    const bookings = db.prepare("SELECT * FROM bookings").all();

    // skickar tillbaka bokningarna
    res.json(bookings);
});

// route för att radera en bokning, behöver login
router.delete("/:id", authMiddleware, (req, res) => {

    // kollar om bokningen finns
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(req.params.id);
    if (!booking) return res.status(404).json({ message: "Bokning hittades inte" });

    // tar bort bokningen
    db.prepare("DELETE FROM bookings WHERE id = ?").run(req.params.id);

    // skickar bekräftelse
    res.json({ message: "Bokning raderad" });
});

// exporterar routern
module.exports = router;