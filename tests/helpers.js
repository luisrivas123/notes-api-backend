const supertest = require('supertest')

const { app } = require('../index')

const api = supertest(app)

const initialNotes = [
  {
    title: 'Tutorial 1',
    content: 'Esto es una nota de luis',
    userId: 2,
    date: new Date(),
    important: true
  },
  {
    title: 'Tutorial 2',
    content: 'Esto es otra nota nueva',
    userId: 1,
    date: new Date(),
    important: true
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

module.exports = { initialNotes, api, getAllContentFromNotes }