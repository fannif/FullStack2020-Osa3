require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

const cors = require('cors')

morgan.token('bodyData', function(request, response) {
    return JSON.stringify(request.body);
});

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
    }).catch(error => next(error))

 //   const id = Number(request.params.id)
//    const person = persons.find(person => person.id === id)
    // if (person) {
    //     response.json(person)
    //   } else {
    //     response.status(404).end()
    //   }    
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    }).catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(
            `<p>Phonebook has info for ${persons.length} people.</p>
            <p>${new Date()}</p>`
        )
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
//    const id = Number(request.params.id)
//    persons = persons.filter(person => person.id !== id)
  
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        }).catch(error => next(error))
})

const getRandomInt = (max) => {
    const value = Math.floor(Math.random() * Math.floor(max))
    return value;
  }
  
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({ 
          error: 'Name already exists' 
        })
    }
    
    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name is missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'Number is missing' 
        })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    //  id: getRandomInt(999999),
    })
  
    // persons = persons.concat(person)
  
    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    }).catch(error => (error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'Malformatted id' })
    } else if (error.name == 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})