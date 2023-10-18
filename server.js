const express = require("express");
const path = require("path");
const cors = require("cors");

const router = require("./src/routes/routerApi.js");

const app = express();
const port = process.env.PORT || 9536;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
