import mongoose, {Schema} from 'mongoose'
import {
  auth,
  created,
  merge,
  modified
  } from '../../src/rest/schema/plugins'

const schema = new Schema({
  name: String,
  description: String,
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  },
  password: String,
  firstname: String,
  lastname: String,
  location: {
    type: [Number],
    index: '2dsphere'
  }
})

schema.plugin(auth)
schema.plugin(created)
schema.plugin(merge)
schema.plugin(modified)

export default mongoose.model('User', schema)
