// laddar miljövariabler från .env
require("dotenv").config();

// importerar express
const express = require("express");

// importerar cors för att tillåta cross-origin requests
const cors = require("cors");

// importerar routes
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// skapar express-app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/bookings", bookingRoutes);

// test-route
app.get("/", (req, res) => {
    res.json({ message: "API fungerar" });
});

// startar server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servern körs på ${PORT}`);
});