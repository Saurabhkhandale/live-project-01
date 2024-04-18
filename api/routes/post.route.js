import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("it's working");
});



export default router;