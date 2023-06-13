const tally = require('../model/tally')
// const { data } = require('./data') add data.js file to add data into mongo db

const refreshAll = async () => {
    await tally.deleteMany({})
    await tally.insertMany(data)
}
refreshAll()