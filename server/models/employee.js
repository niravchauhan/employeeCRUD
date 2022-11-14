const mongoose = require('mongoose');
const employeeSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date },
    address: { type: String },
    photo: { type: String },
    createdOn: { type: Date, default: Date.now() },
    updatedOn: { type: Date, default: Date.now() }
});
mongoose.model('employee', employeeSchema);
module.exports = mongoose.model('employee');