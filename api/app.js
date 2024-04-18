import express from "express";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
// import userRoute from "./routes/user.route.js";


const app = express();
const port = process.env.PORT || 8800;


app.use(express.json());


app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
// app.use("/api/user", userRoute);




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} !!!`);
});