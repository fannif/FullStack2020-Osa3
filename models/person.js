const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URI

console.log('connecting to database')
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to database')
  })
  .catch((error) => {
    console.log('error connecting to database:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: 
      { type: String, 
        required: true, 
        minlength: 3,
        unique: true 
      },
    number: 
      { type: String, 
        minlength: 8,
        required: true 
      }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedPerson) => {
    returnedPerson.id = returnedPerson._id.toString()
    delete returnedPerson._id
    delete returnedPerson.__v
  }
})

module.exports = mongoose.model('Person', personSchema)