require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
// const logger = require('./loggerMiddleware')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  const { id } = request.params

  Note.findById(id)
    .then(note => {
      return note
        ? response.json(note)
        : response.status(404).end()
      // if (note) {
      //   response.json(note)
      // } else {
      //   response.status(404).end()
      // }
    }).catch(err => next(err))
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  // console.log(note)
  if (!note.body) {
    return response.status(400).json({
      error: 'require "body" field is missing'
    })
  }

  const newNote = new Note({
    title: note.title,
    body: note.body,
    date: new Date(),
    userId: note.userId,
    important: typeof note.important !== 'undefined' ? note.important : false
  })

  newNote.save().then(saveNote => {
    response.status(201).json(saveNote)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body
  const noteUpDate = {
    title: note.title,
    body: note.body,
    userId: note.userId,
    important: note.important
  }

  Note.findByIdAndUpdate(id, noteUpDate, { new: true })
    .then(result => {
      response.status(201).json(result)
    })
})

app.delete('/api/notes/:id', (request, response, next) => {
  const { id } = request.params

  Note.findByIdAndRemove(id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
