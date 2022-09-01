const mongose = require('mongoose')

const { server } = require('../index')
const Note = require('../models/Note')
const {
  api,
  initialNotes,
  getAllContentFromNotes
} = require('./helpers')

// Antes de cada test

beforeEach(async () => {
  await Note.deleteMany({})

  const note1 = new Note(initialNotes[0])
  await note1.save()

  const note2 = new Note(initialNotes[1])
  await note2.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('content-type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about ', async () => {
  const { contents } = await getAllContentFromNotes()

  expect(contents).toContain('Esto es una nota de luis')
})

test('note without content is not added', async () => {
  const newNote = {
    title: 'tutorial 3',
    content: 'proximamente async/await',
    userId: 2,
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { contents, response } = await getAllContentFromNotes()

  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.content)
})

test('a valid note can be added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  mongose.connection.close()
  server.close()
})
