import { Modal, Button, Container, Navbar } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { EmployeeContext } from '../contexts/EmployeeContext';
import Employee from './Employee';
import AddEditForm from './AddEditForm';
import Loader from './Loader';
// import Pagination from './Pagination';

const EmployeeList = () => {

    const { employees, loaderEmp } = useContext(EmployeeContext);

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        handleClose();
    }, [employees])

    return (
        <div className='main-container pos-relative'>
            {loaderEmp ? <Loader /> : <>
                <Navbar sticky="top" bg="warning" variant="dark">
                    <Container>
                        <Navbar.Brand>
                            <h2>Employees</h2>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                <Button onClick={handleShow} className="btn btn-warning align-center" data-toggle="modal">
                                    <i className="material-icons align-center">&#xE147;</i> </Button>
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <Container>
                    <div className='flex-center f-wrap'>
                        {
                            employees.length ?
                                employees.map(employee => (
                                    <Employee key={employee._id} employee={employee} />
                                ))
                                :
                                <div className='flex-center'>No Employee found</div>
                        }
                    </div>
                </Container>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add Employee
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddEditForm type="add" />
                    </Modal.Body>
                </Modal>
            </>}
        </div>
    )
}

export default EmployeeList;