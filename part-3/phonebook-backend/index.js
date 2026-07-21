require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

const generateId = () => {
  let id;
  do {
    id = Math.floor(Math.random() * 1000000);
  } while (persons.some((p) => p.id === id));
  return String(id);
};

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
  Person.find({}).then((returnedPersons) => {
    res.json(returnedPersons);
  });
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
  const name = req.body.name;
  const number = req.body.number;

  if (!name || !number)
    return res.status(400).json({ error: "name or number is missing" });

  const newPerson = new Person({ name, number });

  newPerson
    .save()
    .then((savedPerson) => {
      console.log(`saved ${savedPerson.name} successfully`);
      res.json(savedPerson);
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ error: error.message });
    });
});
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.use(express.static("dist"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
