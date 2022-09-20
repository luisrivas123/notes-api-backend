const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)

  // Note.find({}).then(notes => {
  //   response.json(notes)
  // })
})

notesRouter.get('/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  const { id } = request.params

  Note.findById(id)
    .then(note => {
      return note
        ? response.json(note)
        : response.status(404).end()
    }).catch(err => next(err))
})

notesRouter.post('/', async (request, response, next) => {
  // const note = request.body
  // Desestructuración
  const { title, content, userId, important = false } = request.body

  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    title,
    content,
    date: new Date(),
    // important: typeof note.important !== 'undefined' ? note.important : false
    important,
    user: user._id
  })

  // newNote.save().then(savedNote => {
  //   response.status(201).json(savedNote)
  // }).catch(err => next(err))

  try {
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.body
  const noteUpDate = {
    title: note.title,
    content: note.content,
    userId: note.userId,
    important: note.important
  }

  Note.findByIdAndUpdate(id, noteUpDate, { new: true })
    .then(result => {
      response.status(201).json(result)
    })
})

notesRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params
  Note.findByIdAndRemove(id)
    .then(() => response.status(204).end())
    .catch(error => next(error))

  // await Note.findByIdAndRemove(id)
  // response.status(204).end()
})

module.exports = notesRouter
