import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import postRoutes from "./routes/PostRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import likeRoutes from "./routes/likeRoute.js";
import photoRoutes from "./routes/photoRoute.js";
import path from 'path';
import { fileURLToPath } from "url";

//configure env
dotenv.config();
console.log(process.env.DEV_MODE);

//database config
connectDB();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './client/build')))

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment",commentRoutes);
app.use("/api/v1/like",likeRoutes);
app.use("/api/v1/photo",photoRoutes);

//rest api
// app.get("/", (req, res) => {
//   res.send("<h1>Welcome to Blogging Website</h1>");
// });
app.use('*',function(req, res){
  res.sendFile(path.join(__dirname, './client/build/index.html'));
})

//PORT
const PORT = process.env.port || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
