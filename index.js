const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },

  {
    id: 2,
    name: "Ada Lovelace",
    number: "021-23499",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "020-456234",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "456-3245678",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> ${Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateId = () => {
  return Math.random();
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and number are missing",
    });
  }

  const result = persons.find((person) => person.name === body.name);
  console.log(result);
  if (result) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  };

  persons = persons.concat(person);

  response.status(201).json(persons);
});

const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: "unknow endpoint" });
};

app.use(unknowEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
