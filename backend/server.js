const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");


dotenv.config();
const app = express();
app.use(cors({
  origin: ["http://localhost:3000", // frontend URL
            "https://fsd-sample-test-n4kq.vercel.app"
          ],
  method: ["GET","POST","PUT","DELETE"],        
  credentials: true
}));
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
