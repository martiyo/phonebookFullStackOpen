require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> ${Date()}`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
    //(response.status(404).end());
  });
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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });

  /* if (!body.name || !body.number) {
     *   return response.status(400).json({
     *     error: "name and number are missing",
     *   });
     * }

     * const result = persons.find((person) => person.name === body.name);
     * console.log(result);
     * if (result) {
     *   return response.status(400).json({
     *     error: "name must be unique",
     *   });
     * }

     * const person = {
     *   name: body.name,
     *   number: body.number,
     *   date: new Date(),
     *   id: generateId(),
     * };

     * persons = persons.concat(person);

     * response.status(201).json(persons); */
});

const unknowEndpoint = (request, response) => {
  response.status(404).send({ error: "unknow endpoint" });
};

app.use(unknowEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
