import mongoose from 'mongoose'

let Schema = mongoose.Schema
let schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  },
  superuser: Boolean,
  description: String
})

export default mongoose.model('Role', schema)
