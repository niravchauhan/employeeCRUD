const router = require('express').Router();
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator')
const employee = require('../models/employee');
const multer = require("multer");
const path = require('path');
// var dir = "./server/files";
// if (!path.existsSync(dir)) {
//     fs.mkdirSync(dir, 0744);
// }
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './server/files')
    },
    filename: function (req, file, cb) {
        const fileName = path.basename(file.originalname).split('.').slice(0, -1).join('.') + "_" + Date.now() + path.extname(file.originalname)
        cb(null, fileName) //Appending extension
    }
});

var upload = multer({ storage: storage });
// Middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.all('/', function (req, res) {
    return res.status(400).json({ status: true, message: 'employee controller working...' })
});
router.post('/uploadFile', upload.any(), async (req, res) => {
    try {
        console.log(req.files)
        if (req.files.length)
            res.status(200).json({ success: true, message: 'Success', file: req.files[0] })
        else res.status(400).json({ success: false, error: "Error in file upload" })
    } catch (ex) {
        res.status(500).json({ success: false, error: ex })
    }
})

router.get('/getallEmployee', async (req, res) => {
    try {
        employee.find({},
            { __v: 0 },
            (error, result) => {
                if (error)
                    return res.status(400).json({ success: false, message: 'Error in getting employee list', error })

                return res.status(200).json({ success: true, message: 'Success', list: result })
            }
        )
    } catch (ex) {
        res.status(500).json({ success: false, error: ex })
    }
})

router.post('/addEmployee', [
    check('name').not().isEmpty().trim().escape(),
    check('age').not().isEmpty().trim().escape(),
    check('email').not().isEmpty().trim().escape()
], async (req, res) => {
    try {
        console.log("Inside Add New employee");
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422)
                .send({
                    success: false,
                    message: "Form validation error ",
                    errors: errors.array()
                });

        var newEmpDetails = new employee({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            dob: req.body.dob || "",
            address: req.body.address || "",
            photo: req.body.photo || "",
        });
        newEmpDetails.save(function (error, result) {
            if (error)
                return res.status(400).send({ success: false, message: 'Error in employee creation', error });

            return res.status(200).send({ success: true, message: 'Success', user: result });
        })
    } catch (ex) {
        res.status(500).json({ success: false, error: ex })
    }
}
);

router.post('/updateEmp', [
    check('_id').not().isEmpty().trim().escape(),
    check('name').not().isEmpty().trim().escape(),
    check('age').not().isEmpty().trim().escape(),
    check('email').not().isEmpty().trim().escape()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422)
                .send({
                    success: false,
                    message: "Form validation error ",
                    errors: errors.array()
                });

        const empID = req.body._id || "";
        employee.updateOne(
            { _id: empID },
            {
                name: req.body.name,
                email: req.body.email,
                age: req.body.age,
                dob: req.body.dob || "",
                address: req.body.address || "",
                photo: req.body.photo || "",
                updatedOn: Date.now()
            },
            (error, result) => {
                if (error)
                    return res.status(400).json({ success: false, message: 'DB update failed', error });
                return res.status(200).json({ success: true, message: 'Success' });
            }
        );
    } catch (ex) {
        res.status(500).json({ success: false, error: ex })
    }
})

router.delete('/deleteEmployee/:emp_id', async (req, res) => {
    try {
        if (req.params.emp_id)
            employee.deleteOne({ _id: req.params.emp_id },
                (error, result) => {
                    if (error)
                        return res.status(400).json({ success: false, message: 'Some Error while removing employee', error });
                    return res.status(200).json({ success: true, message: 'Success', result });
                }
            );
        else
            return res.status(500).json({ success: false, message: 'DB update failed', error });
    } catch (ex) {
        res.status(500).json({ success: false, error: ex })
    }
});

module.exports = router;