const mongoose = require('mongoose');
const connect = () => {
    mongoose.connect("mongodb://127.0.0.1:27017" + "/covidtally"
        , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("connection established with mongodb server online"); })
    .catch(err => {
        console.log("error while connection", err)
    });
}
module.exports = connect;
