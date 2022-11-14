import { createContext, useEffect, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { defaultURL } from '../components/common'
const URL = defaultURL.employee, FILES_URL = defaultURL.files;

export const EmployeeContext = createContext()

const EmployeeContextProvider = (props) => {
    const [employees, setEmployees] = useState([])

    useEffect(() => {
        axios.get(`${URL}/getallEmployee`).then((resp) => {
            resp = resp.data;
            if (resp.success) {
                const list = typeof resp.list == "string" ? JSON.parse(resp.list) : resp.list;
                const sortedEmployees = list.sort((a, b) => (a.name < b.name ? -1 : 1));
                sortedEmployees.forEach(emp => emp.previewImg = FILES_URL + emp.photo);
                setEmployees(sortedEmployees);
            }
        }).catch((err) =>
            console.log(err)
        );
    }, [])

    const addOrUpdateEmp = (employee, type) => {
        type === "add" ? addEmployee(employee) : updateEmployee(employee)
    }

    const addEmployee = (employee) => {
        axios.post(`${URL}/addEmployee`, employee).then((resp) => {
            resp = resp.data;
            if (resp.success) {
                const user = typeof resp.user == "string" ? JSON.parse(resp.user) : resp.user;
                employee._id = user._id;
                setEmployees([...employees, employee])
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    const deleteEmployee = (_id) => {
        axios.delete(`${URL}/deleteEmployee/${_id}`).then((resp) => {
            resp = resp.data;
            if (resp.success)
                setEmployees(employees.filter(employee => employee._id !== _id))
        }).catch((err) => {
            console.log(err);
        });
    }

    const updateEmployee = (updatedEmployee) => {
        axios.post(`${URL}/updateEmp`, updatedEmployee).then((resp) => {
            resp = resp.data;
            if (resp.success)
                setEmployees(employees.map((employee) => employee._id === updatedEmployee._id ? updatedEmployee : employee))
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <EmployeeContext.Provider value={{ employees, addOrUpdateEmp, addEmployee, deleteEmployee, updateEmployee }}>
            {props.children}
        </EmployeeContext.Provider>
    )
}

export default EmployeeContextProvider;