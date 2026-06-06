// importerar jsonwebtoken för att hantera JWT
const jwt = require("jsonwebtoken");

// middleware som kollar om en användare är inloggad
const authMiddleware = (req, res, next) => {

    // hämtar authorization-headern
    const authHeader = req.headers.authorization;

    // om ingen token finns, skicka 401
    if (!authHeader) {
        return res.status(401).json({ message: "Ingen token skickad" });
    }

    // tar bort "Bearer " från headern och sparar själva token
    const token = authHeader.split(" ")[1];

    try {
        // verifierar token med hemligheten från miljövariabel
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // sparar användardata i request för att kunna användas senare
        req.user = decoded;

        next();
    } catch (err) {
        // om token är ogiltig, skicka 401
        return res.status(401).json({ message: "Ogiltig token" });
    }
};

// exporterar middleware så vi kan använda den i routes
module.exports = authMiddleware;