const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.send("IGSA Portal API is running");
});
const eventRoutes = require("./routes/eventRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const boardMemberRoutes = require("./routes/boardMemberRoutes");
const messageRoutes = require("./routes/messageRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/board-members", boardMemberRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});