// importerar express
const express = require("express");

// importerar bcrypt för att hasha lösenord
const bcrypt = require("bcrypt");

// importerar jwt för tokens
const jwt = require("jsonwebtoken");

// importerar databasen
const db = require("../database/db");

// importerar vår auth-middleware
const authMiddleware = require("../middleware/authMiddleware");

// skapar en router
const router = express.Router();

// route för att registrera ny användare
router.post("/register", async (req, res) => {

    // hämtar username och password från request body
    const { username, password } = req.body;

    // om något saknas, skicka 400
    if (!username || !password) {
        return res.status(400).json({ message: "Input saknas" });
    }

    try {
        // hashar lösenordet
        const hashed = await bcrypt.hash(password, 10);

        try {
            // sparar användaren i databasen
            db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashed);
            res.status(201).json({ message: "Användare skapad" });
        } catch (err) {
            // om användaren redan finns
            res.status(400).json({ message: "Användare finns redan" });
        }

    } catch (err) {
        // serverfel
        res.status(500).json({ message: "Server error" });
    }
});

// route för att logga in
router.post("/login", async (req, res) => {

    // hämtar username och password från request body
    const { username, password } = req.body;

    // om något saknas, skicka 400
    if (!username || !password) {
        return res.status(400).json({ message: "Input saknas" });
    }

    try {
        // hämtar användare från databasen
        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

        if (!user) {
            return res.status(400).json({ message: "Fel användarnamn eller lösenord" });
        }

        // jämför lösenord med hashet version
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ message: "Fel användarnamn eller lösenord" });
        }

        // skapar en token som gäller 1h
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // skickar token till klienten
        res.json({ message: "Inloggad", token });

    } catch (err) {
        // serverfel
        res.status(500).json({ message: "Server error" });
    }
});

// exempel på skyddad route
router.get("/protected", authMiddleware, (req, res) => {
    // returnerar skyddad data och användarinformation
    res.json({
        message: "Skyddad data",
        user: req.user
    });
});

// exporterar routern
module.exports = router;