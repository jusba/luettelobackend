require('dotenv').config()

const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(express.static('build'))
const Person = require('./models/node')

morgan.token('info', function (req, res)

{if (req.method === 'POST'){const Person = require('./models/node')
  return JSON.stringify(req.body)}
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))
app.use(cors())



let persons = [
  {
    'name': 'Arto Hellas',
    'number': '123',
    'id': 1
  },
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
    'id': 2
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'id': 3
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
    'id': 4
  }
]

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send('<p> Phonebook has info for '+ persons.length + ' people </p> <br />'
        + '<p>'+ new Date()+ '</p>'
    )
  })


})

app.get('/api/persons', (req, res) => {

  Person.find({}).then(persons => {

    res.json(persons)
  })


})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person){
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }

    })
    .catch(error =>
      next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  console.log('id on:' ,request.body.id)
  const person = {
    name: request.body.name,
    number: request.body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new:true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))

})

app.post('/api/persons', (request, response,next) => {
  //const id = Math.floor(Math.random() * Math.floor(9999))
  console.log('numero:',request.body.number, 'nimi', request.body.name)



  if (persons.filter(person => person.name === request.body.name).length > 0){
    return response.status(400).json({
      error: 'name must be unique' + request.body.name
    })
  } else {
    const person = new Person({
      name: request.body.name,
      number: request.body.number
    })
    person.save().then(savedPerson => {
      response.json(savedPerson.toJSON())
    }).catch(error =>
      next(error))

  }


  /*person.id = id
    persons = persons.concat(person)
    response.json(person)*/

})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {


  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})