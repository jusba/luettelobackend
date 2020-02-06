const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

morgan.token('info', function (req, res) 
    
    {if (req.method === "POST"){
        return JSON.stringify(req.body)} 
    })
        
        

app.use(express.json()) 
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :info'))
app.use(cors())


let persons = [
    {
        "name": "Arto Hellas",
        "number": "123",
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

app.get('/info', (req, res) => {
    const size = persons.length
    res.send('<p> Phonebook has info for '+ size + ' people </p> <br />'
    + '<p>'+ new Date()+ '</p>'
    )
    
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id|| console.log(person.id))
    if (person){
        response.json(person)
    } else {
        response.status(404).end()    
    }
   
})

app.delete('/api/persons/:id', (request, response) => {
    
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * Math.floor(9999))
    if (!request.body.number || !request.body.name){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    
    if (persons.filter(person => person.name === request.body.name).length > 0){
        return response.status(400).json({
            error: "name must be unique" + request.body.name
        })
    }
    const person = request.body
    person.id = id
    persons = persons.concat(person)    
    response.json(person)

})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})