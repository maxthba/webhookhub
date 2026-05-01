import express from "express";
import cors from "cors";
import {db} from "./config/firebase";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.get("/test-db", async (req, res) =>{
  const test = await db.collection("firebase-integration-test").add({
    message: "firebase funcionando",
    createdAt: new Date(),
  });

  res.json({
    id: test.id
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});