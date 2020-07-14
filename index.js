const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')

morgan.token('bodyData', function(request, response) {
    return JSON.stringify(request.body);
});

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyData'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }    
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date()}</p>`
        )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const getRandomInt = (max) => {
    const value = Math.floor(Math.random() * Math.floor(max))
    return value;
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name is missing' 
      })
    }

    if (persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({ 
          error: 'Name already exists' 
        })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'Number is missing' 
        })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: getRandomInt(999999),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})