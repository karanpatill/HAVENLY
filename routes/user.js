const express = require('express');
const router = express.Router();

router.get("/" , (req , res) => {
    res.send("Get for users");
});

router.get("/:id", (req, res) => {
    res.send(`Get for user with ID: `);
});

router.post("/", (req, res) => {
    res.send("Post for users");
});

router.delete("/:id", (req, res) => {
    res.send("Delete for users");
});

module.exports = router;