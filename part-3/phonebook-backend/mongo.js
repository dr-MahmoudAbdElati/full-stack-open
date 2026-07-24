const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://Mahmoud-Abdelati:${password}@cluster0.xcellr3.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const main = async () => {
  try {
    await mongoose.connect(url, { family: 4 })

    if (process.argv.length === 3) {
      const people = await Person.find({})
      console.log('phonebook:')
      people.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      return
    }

    if (process.argv.length !== 5) {
      console.log('give name and number as arguments')
      process.exit(1)
    }

    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({ name, number })
    const savedPerson = await person.save()

    console.log(
      `added ${savedPerson.name} number ${savedPerson.number} to phonebook`,
    )
  } finally {
    await mongoose.connection.close()
  }
}

main().catch((error) => {
  console.error('error:', error.message)
  process.exit(1)
})
