const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./auth"));
app.use("/campaign", require("./campaign"));
app.use("/track", require("./track"));
app.use("/analytics", require("./analytics"));

app.listen(5000, () => console.log("Server running on 5000"));