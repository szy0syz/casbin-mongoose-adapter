const mongoose = require('mongoose')

const CasbinRuleSchema = new mongoose.Schema({
  p_type: String,
  v0: String,
  v1: String,
  v2: String,
  v3: String,
  v4: String,
  v5: String,
}, { timestamps: true });

mongoose.model('CasbinRule', CasbinRuleSchema)