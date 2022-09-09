const mongose = require('mongoose')
const bcrypt = require('bcrypt')

const { server } = require('../index')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')

describe('craeting a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({ username: 'Lukas', passwordHash })

    await user.save()
  })

  test('works as expected creating a fresh username',
    async () => {
      const userAtStart = await getUsers()

      const newUser = {
        username: 'luis',
        name: 'rivas',
        password: 'tw1tch'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('content-type', /application\/json/)

      const userAtEnd = await getUsers()

      expect(userAtEnd).toHaveLength(userAtStart.length + 1)

      const usernames = userAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

  afterAll(() => {
    mongose.connection.close()
    server.close()
  })
})
