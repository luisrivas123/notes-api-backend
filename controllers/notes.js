const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
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
  const note = request.body
  // console.log(note)
  if (!note.content) {
    return response.status(400).json({
      error: 'require "content" field is missing'
    })
  }

  const newNote = new Note({
    title: note.title,
    content: note.content,
    date: new Date(),
    userId: note.userId,
    important: typeof note.important !== 'undefined' ? note.important : false
  })

  // newNote.save().then(savedNote => {
  //   response.status(201).json(savedNote)
  // }).catch(err => next(err))

  try {
    const savedNote = await newNote.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const note = request.content
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
