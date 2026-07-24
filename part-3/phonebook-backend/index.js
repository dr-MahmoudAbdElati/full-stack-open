require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

const connectToDatabase = Person.connectToDatabase

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

app.get('/info', (req, res) => {
  const date = new Date()
  const requestTime = date.toString()
  Person.find({}).then((result) => {
    res.send(`
      <p>Phonebook has info for ${result.length} people</p>
      <p>${requestTime}</p>
      `)
  })
})
app.get('/api/persons', (req, res) => {
  Person.find({}).then((returnedPersons) => {
    res.json(returnedPersons)
  })
})
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id).then((result) => {
    if (result) return res.status(200).json(result)

    res.status(404).json({
      error: 'person not found',
    })
  })
})
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number)
    return res.status(400).json({ error: 'name or number is missing' })

  const newPerson = new Person({ name, number })

  newPerson
    .save()
    .then((savedPerson) => {
      console.log(`saved ${savedPerson.name} successfully`)
      res.json(savedPerson)
    })
    .catch((error) => {
      console.error(error)
      res.status(400).json({ error: error.message })
    })
})
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => {
      console.log(error)
      next(error)
    })
})
app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { returnDocument: 'after', runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        console.log(updatedPerson)
        res.status(200).json(updatedPerson)
      } else {
        res.status(404).json({ error: 'person not found' })
      }
    })
    .catch((error) => {
      next(error)
    })
})

const unknownMiddleware = (req, res) => {
  res.status(404).send({ error: 'endpoint not found' })
}
app.use(unknownMiddleware)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })
