const express = require("express");
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", (req, res) => {
    const { name, phone, date, guests } = req.body;
    if (!name || !phone || !date || !guests) {
        return res.status(400).json({ message: "Input saknas" });
    }
    db.prepare("INSERT INTO bookings (name, phone, date, guests) VALUES (?, ?, ?, ?)").run(name, phone, date, guests);
    res.status(201).json({ message: "Bokning skapad" });
});

router.get("/", authMiddleware, (req, res) => {
    const bookings = db.prepare("SELECT * FROM bookings").all();
    res.json(bookings);
});

router.delete("/:id", authMiddleware, (req, res) => {
    const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(req.params.id);
    if (!booking) return res.status(404).json({ message: "Bokning hittades inte" });
    db.prepare("DELETE FROM bookings WHERE id = ?").run(req.params.id);
    res.json({ message: "Bokning raderad" });
});

module.exports = router;