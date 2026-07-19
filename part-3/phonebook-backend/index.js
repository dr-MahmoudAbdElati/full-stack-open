const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3001;

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  let id;
  do {
    id = Math.floor(Math.random() * 1000000);
  } while (persons.some((p) => p.id === id));
  return String(id);
};

app.use(cors());

app.use(express.json());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/info", (req, res) => {
  const personsCount = persons.length;
  const date = new Date();
  const requestTime = date.toString();

  res.send(`
    <p>Phonebook has info for ${personsCount} people</p>
    <p>${requestTime}</p>
    `);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (!person)
    return res
      .status(404)
      .json({
        error: "that person wasn not found",
      })
      .end();

  res.status(200).json(person);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).json({ error: "name or number is missing" });

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  const duplicateName = persons.find((p) => p.name === newPerson.name);

  if (duplicateName)
    return res.status(400).json({
      error: "name must be unique, that person already exists in the phonebook",
    });

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
