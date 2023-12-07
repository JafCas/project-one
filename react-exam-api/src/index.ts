import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (request, response) => {
  const Entry = await prisma.entry.findMany();

  response.json(Entry);
});

app.post("/api/notes", async (request, response) => {
  const { title, content, author } = request.body;
  if (!title || !content || !author) {
    return response.status(400).send("title and content fields required");
  }

  try {
    const entry = await prisma.entry.create({
      data: { title, content, author },
    });
    response.json(entry);
  } catch (error) {
    response.status(500).send("Ewe algo esta mal");
  }
});

app.put("/api/notes/:id", async (request, response) => {
  const { title, content, author } = request.body;
  const id = parseInt(request.params.id);

  if (!title || !content || !author) {
    return response.status(400).send("title and content fields required");
  }

  if (!id || isNaN(id)) {
    return response.status(400).send("ewe te equivocaste con el ID");
  }

  try {
    const updatedNote = await prisma.entry.update({
      where: { id },
      data: { title, content, author },
    });
    response.json(updatedNote);
  } catch (error) {
    response.status(500).send("Ewe algo salio mal");
  }
});

app.delete("/api/notes/:id", async (request, response) => {
  const id = parseInt(request.params.id);

  if (!id || isNaN(id)) {
    return response.status(400).send("ewe te equivocaste con el ID");
  }

  try {
    await prisma.entry.delete({
      where: { id },
    });
    response.status(204).send()
  } catch (error) {
    response.send(500).send("opps me llevalv algo salio mal");
  }
});

app.listen(173, () => {
  console.log("evrifing reri at port 0173");
});
