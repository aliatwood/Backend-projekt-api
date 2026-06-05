const express = require("express");
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => {
    const menu = db.prepare("SELECT * FROM menu").all();
    res.json(menu);
});

router.get("/:id", (req, res) => {
    const item = db.prepare("SELECT * FROM menu WHERE id = ?").get(req.params.id);
    if (!item) return res.status(404).json({ message: "Rätten hittades inte" });
    res.json(item);
});

router.post("/", authMiddleware, (req, res) => {
    const { name, description, price, category } = req.body;
    if (!name || !price || !category) {
        return res.status(400).json({ message: "Input saknas" });
    }
    db.prepare("INSERT INTO menu (name, description, price, category) VALUES (?, ?, ?, ?)").run(name, description, price, category);
    res.status(201).json({ message: "Rätt skapad" });
});

router.put("/:id", authMiddleware, (req, res) => {
    const { name, description, price, category } = req.body;
    const item = db.prepare("SELECT * FROM menu WHERE id = ?").get(req.params.id);
    if (!item) return res.status(404).json({ message: "Rätten hittades inte" });
    db.prepare("UPDATE menu SET name = ?, description = ?, price = ?, category = ? WHERE id = ?").run(name, description, price, category, req.params.id);
    res.json({ message: "Rätt uppdaterad" });
});

router.delete("/:id", authMiddleware, (req, res) => {
    const item = db.prepare("SELECT * FROM menu WHERE id = ?").get(req.params.id);
    if (!item) return res.status(404).json({ message: "Rätten hittades inte" });
    db.prepare("DELETE FROM menu WHERE id = ?").run(req.params.id);
    res.json({ message: "Rätt raderad" });
});

module.exports = router;