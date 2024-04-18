// Imports
const express = require('express');
var morgan = require('morgan')

// Set the app
const app = express();
app.use(express.static('dist'))

// Add middlewre
app.use(express.json());
morgan.token('POST_Content', function getPostContent(req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  else {
    return null;
  }
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :POST_Content'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];



app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    }
    else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});


app.post('/api/persons', (request, response) => {
  const body = request.body;
 

  const person = body;
  if(!person.name) {
    return response.status(400).json({
      error: 'Name is missing'
    });
  }
  if (!person.number) {
    return response.status(400).json({
      error: "Phone number is missing"
    })
  }
  persons.forEach(tempPerson => {
    if (person.name === tempPerson.name) {
      return response.status(400).json({
        error: "Name already exists"
      });
    }
  });

  // Set the id
  person.id = Math.round(Math.random() * 100000);


  persons = persons.concat(person);
  response.json(person);

});


app.get('/info', (request, response) => {
    const now = Date();
    let responseString = `<html><p>Phonebook has info for ${persons.length} people</br>` +
        `<p>${now}</p></html>`;
    response.set('Content-Type', 'text/html');
    response.send(responseString);
});



const hostname = "0.0.0.0";
const port = process.env.port || 3001;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
