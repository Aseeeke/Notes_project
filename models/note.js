const mongoose = require('mongoose')
require('dotenv').config()
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

console.log(`Connecting to ${url}`)

mongoose.connect(url).then(result => {
    console.log("connected to mongodb")
}).catch(error => {
    console.log(`error connecting to mongodb ${error.message}`)
})

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)