// importerar express
const express = require("express");

// importerar databasen
const db = require("../database/db");

// importerar auth-middleware
const authMiddleware = require("../middleware/authMiddleware");

// skapar en router
const router = express.Router();

// route för att hämta hela menyn
router.get("/", (req, res) => {

     // hämtar alla menyposter
    const menu = db.prepare("SELECT * FROM menu").all();

    // skickar tillbaka menyn
    res.json(menu);
});

// route för att hämta en enskild rätt
router.get("/:id", (req, res) => {

    // hämtar menyposten med id
    const item = db.prepare("SELECT * FROM menu WHERE id = ?").get(req.params.id);

    // om inte hittad, skicka 404
    if (!item) return res.status(404).json({ message: "Rätten hittades inte" });

    // annars skicka posten
    res.json(item);
});

// route för att skapa ny rätt, kräver login
router.post("/", authMiddleware, (req, res) => {
    const { name, description, price, category } = req.body;

    // kolla att obligatoriska fält finns
    if (!name || !price || !category) {
        return res.status(400).json({ message: "Input saknas" });
    }

    // lägg till menyposten i databasen
    db.prepare("INSERT INTO menu (name, description, price, category) VALUES (?, ?, ?, ?)").run(name, description, price, category);

    // skickar bekräftelse
    res.status(201).json({ message: "Rätt skapad" });
});

// route för att uppdatera en rätt, kräver login
router.put("/:id", authMiddleware, (req, res) => {
    const { name, description, price, category } = req.body;

    // kolla att posten finns
    const item = db.prepare("SELECT * FROM menu WHERE id = ?").get(req.params.id);
    if (!item) return res.status(404).json({ message: "Rätten hittades inte" });

    // uppdatera posten
    db.prepare("UPDATE menu SET name = ?, description = ?, price = ?, category = ? WHERE id = ?").run(name, description, price, category, req.params.id);

    // bekräfta uppdatering
    res.json({ message: "Rätt uppdaterad" });
});

// route för att radera en rätt, kräver login
router.delete("/:id", authMiddleware, (req, res) => {

    // kolla att posten finns
    const item = db.prepare("SELECT * FROM menu WHERE id = ?").get(req.params.id);
    if (!item) return res.status(404).json({ message: "Rätten hittades inte" });

    // ta bort posten
    db.prepare("DELETE FROM menu WHERE id = ?").run(req.params.id);

    // bekräfta borttagning
    res.json({ message: "Rätt raderad" });
});

// exporterar routern
module.exports = router;