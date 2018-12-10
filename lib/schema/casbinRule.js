const mongoose = require('mongoose')

const Schema = mongoose.Schema
const CabinRuleSchema = new Schema({
  ptype: {
    required: true,
    type: String
  },
  v0: {
    required: true,
    type: String
  },
  v1: {
    type: String
  },
  v2: {
    type: String
  },
  v3: {
    type: String
  },
  v4: {
    type: String
  },
  v5: {
    type: String
  }
})

mongoose.model('CabinRule', CabinRuleSchema)
