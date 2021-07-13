const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

/////////////////////////////////////////////////////////////
// USER COLLECTION/MODEL
/////////////////////////////////////////////////////////////
module.exports = mongoose.model('User', UserSchema)