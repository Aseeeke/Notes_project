const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://aseeeke:${password}@fullstack.u4fz3rs.mongodb.net/noteApp?appName=FullStack`;

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

const studentSchema = new mongoose.Schema({
    name: String,
    class: String,
    gpa: String
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'Life is good man',
    important: true,
})

// note.save().then(result => {
//     console.log('Note saved!')
//     mongoose.connection.close()
// })

Note.find({}).then(result => {
    result.forEach(note => {console.log(note)})
    mongoose.connection.close()
})