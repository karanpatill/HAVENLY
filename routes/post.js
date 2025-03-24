const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Get for posts");
});

router.get("/:id", (req, res) => {
    res.send(`Get for post with ID: `);
});

router.post("/", (req, res) => {
    res.send("Post for posts");
});

router.delete("/:id", (req, res) => {
    res.send(`Delete for post with ID: ${req.params.id}`);
});

module.exports = router;
