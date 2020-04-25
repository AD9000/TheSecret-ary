import express from "express";
import db from "./dbApi";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Post route for submitting the form
app.post("/data", (req, res) => {
  console.log("parsing");
  console.log(req.body);
  // res.sendStatus(200);
  db.readData(req.body.name)
    .then((data) => data.toArray())
    .then((r) => {
      console.log(r);
      res.send(r);
    });
});

app.listen(PORT, () => {
  console.log("Prep done. Ready");
  console.log("Server is running on port", PORT);
});
