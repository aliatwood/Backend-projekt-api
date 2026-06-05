require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API fungerar" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servern körs på ${PORT}`);
});