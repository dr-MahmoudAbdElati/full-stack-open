require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

const connectToDatabase = async () => {
  if (!url) {
    throw new Error('MONGODB_URI is not defined')
  }

  console.log('connecting to', url)
  await mongoose.connect(url, {
    family: 4,
  })
  console.log('connected to MongoDB')
}

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d+$/.test(value)
      },
      message:
        'number must be formatted as XX-XXXXXXX or XXX-XXXXXXX and contain only digits separated by a single hyphen',
    },
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)
Person.connectToDatabase = connectToDatabase

module.exports = Person
