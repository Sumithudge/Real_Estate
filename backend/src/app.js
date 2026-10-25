const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const projectRoutes = require("./routes/projectRoutes");
const builderRoutes = require("./routes/builderRoutes");
const localityRoutes = require("./routes/localityRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const propertyRoutes = require("./routes/propertyRoutes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pune Real Estate API is running",
  });
});

app.use("/api/projects", projectRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/builders", builderRoutes);
app.use("/api/localities", localityRoutes);
app.use("/api/amenities", amenityRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

module.exports = app;