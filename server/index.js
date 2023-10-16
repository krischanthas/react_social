import express from "express";

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
import bodyParser from "body-parser";
import mongoose from "mongoose";

// enables cors, cors defines a way for client web apps loaded in one domain to interact with resources in a different domain.
import cors from "cors";
import dotenv from "dotenv";

// middleware for handling multipart/form-data, which is primarily used for uploading files
import multer from "multer";

// Helmet helps secure Express apps by setting HTTP response headers.
import helmet from "helmet";

// HTTP request logger middleware for node.js
import morgan from "morgan";

// allows us to properly set the paths when we configure directories
import path from "path";
import { fileURLToPath } from "url";

// controllers
import { register } from "./controllers/auth.js";

// auth routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";

// middleware
import { verifyToken } from "./middleware/auth.js";

import { createPost } from "./controllers/posts.js";

// sample data
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
// grab file url when using modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());
// set the directory of where we keep our assets locally, in production this should be stored in cloud storage file directory
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts/", verifyToken, upload.single("picture"), createPost);
/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/** MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

    // inject sample data, only add this data once!!!
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error}, did not connnect`));
