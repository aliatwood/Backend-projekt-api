require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API fungerar" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servern körs på ${PORT}`);
});