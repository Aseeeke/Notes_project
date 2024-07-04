const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config();

const Note = require('./models/note');

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if(note) {
            response.json(note)
        }
        else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id).then(note => {
        response.status(204).end()
    }).catch(error => next(error))
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n=> Number(n.id))) : 0
    return maxId + 1
}

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    }).catch(error => next(error))
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(request.params.id, note, {new: true, runValidators: true, context: 'query'}).then(note => {
        response.json(note)
    }).catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
    console.log(error)

    if(error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    }
    else if(error.name === 'ValidationError') {
        return res.status(400).send({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})