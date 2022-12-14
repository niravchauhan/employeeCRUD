// const assert = require('assert');
const mongoose = require('mongoose');
const db_url = process.env.DB_URL;

mongoose.connect(db_url, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
}, function (error, link) {
    if (error) {
        console.log("Error in DB connection");
    } else {
        console.log("DB connected Successfully");
    }
});