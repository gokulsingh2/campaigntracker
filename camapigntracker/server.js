const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./auth"));
app.use("/campaign", require("./campaign"));
app.use("/track", require("./track"));
app.use("/analytics", require("./analytics"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));