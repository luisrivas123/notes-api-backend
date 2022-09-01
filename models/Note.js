const { model, Schema } = require('mongoose')

const noteSchema = new Schema({
  title: String,
  content: String,
  date: Date,
  userId: Number,
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id
    delete returnObject._id
    delete returnObject.__v
  }
})

const Note = model('Note', noteSchema)

module.exports = Note
