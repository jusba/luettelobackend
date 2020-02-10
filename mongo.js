/*mongodb+srv://jusba:<password>@fullstack-2encc.mongodb.net/test?retryWrites=true&w=majority*/
const mongoose = require('mongoose')

const password = process.argv[2]
const nameinput = process.argv[3]
const numberinput = process.argv[4]

const url = `mongodb+srv://jusba:${password}@fullstack-2encc.mongodb.net/people?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
console.log(password)
const personSchema = new mongoose.Schema({
    name: String,
    number: String
    
  })
const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: nameinput,
    number: numberinput
  })
  
if (nameinput === undefined || numberinput === undefined){
    console.log("Phonebook:")
    Person.find({}).then(result => {
      console.log("tänne", result)
        result.forEach(person => {
          console.log(
            person.name,person.number
          
          )
        })
        mongoose.connection.close()
      })
}else {
  person.save().then(response => {
    console.log('Added',person.name, "number", person.number,"to phonebook");
    mongoose.connection.close();
  })

}

 
