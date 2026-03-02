const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");


dotenv.config();
const app = express();
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true
}));
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/lmDB1")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/api", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
