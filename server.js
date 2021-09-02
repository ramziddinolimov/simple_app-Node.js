const express = require("express");
const app = express();

app.listen(process.env.PORT || 8070);

app.get("/", (req, res) => {
    res.send("Server is working...")
})