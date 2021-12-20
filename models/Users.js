const { Schema, model } = require('mongoose')

const schema = new Schema({
    userID: {
        type: String,
        required: true
    },
    totalyDrinked: {
        type: Number,
        default: 0,
    },
    drinkedLastTime: {
        type: Date,
        default: 0
    }
})

module.exports = model('Users', schema)