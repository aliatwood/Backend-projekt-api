const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Input saknas" });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);

        try {
            db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashed);
            res.status(201).json({ message: "Användare skapad" });
        } catch (err) {
            res.status(400).json({ message: "Användare finns redan" });
        }

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Input saknas" });
    }

    try {
        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

        if (!user) {
            return res.status(400).json({ message: "Fel användarnamn eller lösenord" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Fel användarnamn eller lösenord" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Inloggad", token });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Skyddad data",
        user: req.user
    });
});

module.exports = router;