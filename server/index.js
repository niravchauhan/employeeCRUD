require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT || "9090";
const database = require('./database');

const employeeController = require('./controllers/employee');
//Middleware setup
app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/', function (req, res) {
    return res.send({ status: true, message: "Working." });
});

app.use('/employee', employeeController);

app.use('/files', express.static(__dirname + '/files'));
// Start server
app.listen(PORT, function () {
    console.log('Server running at PORT: ', PORT)
});