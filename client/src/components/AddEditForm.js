import { Form, Button } from "react-bootstrap"

import { EmployeeContext } from '../contexts/EmployeeContext';
import { useContext, useState } from 'react';
import { REGEX, defaultURL } from '../components/common';
import axios from "axios";
import Loader from '../components/Loader'

const URL = defaultURL.employee, FILES_URL = defaultURL.files;


const AddEditForm = (props) => {
    // Default Setup
    const type = props.type;
    const getDefaultObj = () => {
        let defaultObj = props.employee ? props.employee : { _id: "", name: "", dob: "", age: "", email: "", photo: "", address: "" };
        defaultObj.dob = defaultObj.dob ? new Date(defaultObj.dob).toLocaleDateString('en-CA') : defaultObj.dob;
        defaultObj.previewImg = defaultObj.photo ? FILES_URL + defaultObj.photo : "";
        return defaultObj;
    }

    // let errorState = type === 'add' ? false : true;
    // Context setup 
    const { addOrUpdateEmp, resultFromAPI } = useContext(EmployeeContext);
    const [newEmployee, setNewEmployee] = useState(getDefaultObj());
    const [hasError, setError] = useState("");
    const [loader, setLoading] = useState(false);

    const uploadFile = async (e) => {
        e.preventDefault()
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("selectedFile", e.target.files[0]);
            let response = await axios({
                method: "post",
                url: `${URL}/uploadFile`,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            response = response.data
            setLoading(false);
            if (response && response.success) {
                let fileName = response.file.filename;
                setNewEmployee({ ...newEmployee, ...{ "photo": fileName, previewImg: FILES_URL + fileName } });
            }
        } catch (error) {
            console.log(error)
        }
    }
    const onInputChange = (e) => {
        let val = e.target.value, ipKey = e.target.name;
        // val = val.trim()
        if (ipKey === 'dob') val = new Date(val).toLocaleDateString('en-CA')
        setNewEmployee({ ...newEmployee, [ipKey]: val });
        if (name === "" || email === "" || !REGEX["name"].test(name) || !REGEX["email"].test(email))
            setError("Field Contains some error");
        else setError("");
    }

    const { name, dob, age, email, address, previewImg } = newEmployee;

    const handleSubmit = (e) => {
        e.preventDefault();
        addOrUpdateEmp(newEmployee, type);
    }

    return (
        <div className="pos-relative">
            <Form onSubmit={handleSubmit}>
                {loader ? <Loader /> : null}

                {/* Name */}
                <Form.Group>
                    <Form.Label>Employee Name<sup className="error-msg">*</sup></Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Name *"
                        name="name"
                        value={name}
                        onChange={(e) => onInputChange(e)}
                        required
                    />
                    <Form.Text className="text-muted">
                        Only alphabates and white space allowed.
                    </Form.Text>
                </Form.Group>

                {/* email */}
                <Form.Group>
                    <Form.Label>Employee Email <sup className="error-msg">*</sup></Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Email *"
                        name="email"
                        value={email}
                        onChange={(e) => onInputChange(e)}
                        required
                    />
                    <Form.Text className="text-muted">
                        Must be a valid Alphabate.
                    </Form.Text>
                </Form.Group>

                {/* address */}
                <Form.Group>
                    <Form.Label>Employee Address</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Address"
                        rows={3}
                        name="address"
                        value={address}
                        onChange={(e) => onInputChange(e)}
                    />
                </Form.Group>

                {/* age */}
                <Form.Group>
                    <Form.Label>Employee Age</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Age"
                        name="age"
                        min="0"
                        value={age}
                        onChange={(e) => onInputChange(e)}
                    />
                </Form.Group>

                {/* DOB */}
                <Form.Group>
                    <Form.Label>Employee DOB</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="DOB"
                        name="dob"
                        value={dob}
                        max={new Date().toLocaleDateString('en-CA')}
                        onChange={(e) => onInputChange(e)}
                    />
                </Form.Group>

                {/* Photo */}
                <Form.Group>
                    <Form.Label>Employee profile</Form.Label>
                    <div className="profil-preview">
                        {previewImg ? <img src={previewImg} alt="profile" /> : null}
                        <Form.Control
                            type="file"
                            placeholder="photo"
                            name="photo"
                            // value={photo}
                            onChange={(e) => uploadFile(e)}
                        />
                    </div>
                </Form.Group>

                {
                    resultFromAPI && resultFromAPI.success ? <div className="positive-msg">Success</div> : (<div className="error-msg-box">{JSON.stringify(resultFromAPI.error)}</div>)
                }
                {
                    !hasError
                        ? <Button variant="success" type="submit" block>
                            {type === "add" ? "Add New Employee" : "Update"}
                        </Button>
                        : <div className="error-msg">{hasError}</div>
                }
            </Form >
        </div >

    )
}

export default AddEditForm;