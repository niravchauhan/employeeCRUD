import { useContext, useState, useEffect } from 'react';
import { EmployeeContext } from '../contexts/EmployeeContext';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AddEditForm from './AddEditForm';
import swal from 'sweetalert';
import { timeSince } from './common'


const Employee = ({ employee }) => {

    const { deleteEmployee } = useContext(EmployeeContext)

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        handleClose()
    }, [employee])

    return (
        <>
            <div className='custom-card'>
                <div className='card-action'>
                    <OverlayTrigger
                        overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}>
                        <button onClick={handleShow} className="btn text-warning btn-act" data-toggle="modal"><i className="material-icons">&#xE254;</i></button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        overlay={<Tooltip id={`tooltip-top`}>Delete</Tooltip>}>
                        <button onClick={() => {
                            swal({
                                title: "Delete", text: "Are you sure you want to delete this employee!",
                                icon: "warning", buttons: true,
                                dangerMode: true,
                            }).then((willDelete) => {
                                if (willDelete) deleteEmployee(employee._id);
                            });
                        }} className="btn text-danger btn-act" data-toggle="modal"><i className="material-icons">&#xE872;</i></button>
                    </OverlayTrigger>
                </div>
                <div className='card-details'>
                    <div className='profile-img left'>
                        <img src={employee.previewImg} alt="profile" />
                    </div>
                    <div className='right info'>
                        <div>
                            <b>{employee.name}</b> ({employee.age} Years old)
                            <span className='emp-time ml-1'>{timeSince(employee.createdOn)}</span>
                        </div>
                        <div className='emp-email icon-with-data align-center'><i className="material-icons email">&#xe0be;</i>{employee.email}</div>
                        <div className='emp-add icon-with-data align-center'><i className="material-icons location_on">&#xe0c8;</i>{employee.address}</div>
                    </div>
                </div>
            </div>

            <Modal show={show} scrollable={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddEditForm employee={employee} type="edit" />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Employee;