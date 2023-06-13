const mongoose = require('mongoose');

const tallySchema = new mongoose.Schema({
    state: {
        type: String,
        required: [true, 'must provide state'],
    },
    infected: {
        type: Number,
        required: true
    },
    recovered: {
        type: Number,
        required: true
    },
    death: {
        type: Number,
        required: true
    },
})
module.exports = mongoose.model('tally', tallySchema)
