import Navbar from './navbar';
import React, { useEffect, useState } from 'react';
import Annual_Leave from '../images/annual_leave.jpg';
import Maternity_leave from '../images/maternity_leave.jpg';
import Sick_Leave from '../images/sick_leave.jpg';
import Incidental_leave from '../images/incidental_leave.jpg';
import Modal from 'react-modal';
import Waves from '../images/waves.svg'
import Motherhood from '../images/motherhood.svg'
import io from 'socket.io-client';
import Sick from '../images/sick.svg'
import Select from 'react-select';
import Keys from '../keys';
import axios from 'axios';
import '../style.css';


function LeaveRequest() {

    const ioPort = Keys.REACT_APP_SOCKET_PORT;
    const url = Keys.REACT_APP_BACKEND;
    const socket = io.connect(`${ioPort}`);

    const [isAnnualLeaveOpen, setIsAnnualLeaveOpen] = useState(false);
    const [isMaternityLeaveOpen, setIsMaternityLeaveOpen] = useState(false);
    const [isSickLeaveModalOpen, setIsSetLeaveModalOpen] = useState(false);
    const [isIncidentalLeaveModal, setIsIncidentalModalOpen] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [leaveStartDate, setLeaveStartDate] = useState('');
    const [supervisorId, setSupervisorId] = useState([]);
    const [leaveEndDate, setLeaveEndDate] = useState('');
    const [workingDays, setWorkingDays] = useState(0);



    const leaveDiv = {
        width: '80%',
        height: '40%',
        backgroundColor: 'rgb(190, 226, 243)',
        marginTop: '10px',
        marginLeft: '230px',
        borderRadius: '15px'
    }

    const ButtonImages = {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'inline',
        flexWrap: 'wrap',
        gap: '9px',
        marginTop: '45px',
        backgroundColor: 'rgb(190, 226, 243)'
    }

    const modal = {
        overlay: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            width: '53%',
            marginLeft: '295px',
            height: '81vh',
            backgroundColor: 'rgb(206, 206, 236)',
            border: 'none',
            borderRadius: '12px',
            gap: '23px',
            color: "black",
            padding: '12px 0px',
            fontFamily: 'Arial, sans- serif',
            display: 'flex',
        },
    };

    const openIncidentalModal = () => {
        setIsIncidentalModalOpen(true);
    }

    const closeIncidentalLeaveModal = () => {
        setIsIncidentalModalOpen(false);
        setLeaveStartDate('');
        setSelectedSupervisor('');
        setWorkingDays(0);
        setLeaveEndDate('');
    };

    const openSickLeaveModal = () => {
        setIsSetLeaveModalOpen(true);
    }

    const closeSickLeaveModal = () => {
        setIsSetLeaveModalOpen(false);
        setSelectedSupervisor('');
        setLeaveStartDate('');
        setWorkingDays(0);
        setLeaveEndDate('');
    }

    const openMaternityLeaveModal = () => {
        setIsMaternityLeaveOpen(true);
    }

    const closeMaternityLeaveModal = () => {
        setIsMaternityLeaveOpen(false);
        setSelectedSupervisor('');
        setLeaveStartDate('');
        setWorkingDays(0);
        setLeaveEndDate('');
    };

    const openAnnualLeaveModal = () => {
        setIsAnnualLeaveOpen(true);
    }

    const closeAnnualLeaveModal = () => {
        setIsAnnualLeaveOpen(false);
        setSelectedSupervisor('');
        setLeaveStartDate('');
        setWorkingDays(0);
        setLeaveEndDate('');
    }

    const handleStartDate = (event) => {
        setLeaveStartDate(event.target.value);
    };

    const handleEndDate = (event) => {
        const selectedEndDate = new Date(event.target.value)
        setLeaveEndDate(selectedEndDate);
    };

    const supervisor = supervisorId.map((supervisor) => ({
        value: supervisor.id,
        label: supervisor.username
    }));

    const customStyle = {
        control: (provided) => ({
            ...provided,
            width: 190,
            color: 'black',
            border: 'none',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center'
        }),
        option: (provided) => ({
            ...provided,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            '&:hover': {
                backgroundColor: 'black',
                color: 'white'
            }

        }),
        singleValue: (provided) => ({
            ...provided,
            width: '100%',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            color: 'black',
        })
    };

    const handleSupervisorChange = (event) => {
        setSelectedSupervisor(event.value);
    };

    useEffect(() => {
        const showSupervisor = async () => {
            try {
                const response = await axios.get(`${url}/show-supervisor`);
                console.log("Data: ", response.data);
                setSupervisorId(response.data);
            } catch (error) {
                console.error("Error: ", error);
            };
        }
        showSupervisor();
    }, []);

    const holidays = [
        {
            name: 'New Years Day',
            date: '1/1/0000'
        }, {
            name: 'National Heroes Day',
            date: '1/2/0000'
        }, {
            name: 'Good Friday',
            date: '29/3/0000'
        }, {
            name: 'Easter Monday',
            date: '1/4/0000'
        }, {
            name: 'Genocide Memorial Day',
            date: '7/4/0000'
        }, {
            name: 'Eid-al-Fitr',
            date: '10/4/0000'
        }, {
            name: 'Labour Day',
            date: '1/5/0000'
        }, {
            name: 'Eid al-Adha',
            date: '17/6/0000'
        }, {
            name: 'Independence Day',
            date: '1/7/0000'
        }, {
            name: 'Umuganura Day',
            date: '2/8/0000'
        }, {
            name: 'Assumption Day',
            date: '15/8/0000'
        }, {
            name: 'Christmas Day',
            date: '25/12/0000'
        }, {
            name: 'Boxing Day',
            date: '26/12/0000'
        },
    ];

    const getWorkingDaysBetweenDates = (startDate, endDate, holiday) => {

        // console.log("Received startDate: ", startDate, "endDate: ", endDate); // Debugging

        // Ensure both are Date objects
        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            // console.error("startDate or endDate is not a valid Date object");
            return;
        }


        let workingDaysCount = 0;

        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();

        for (let year = startYear; year <= endYear; year++) {
            const startMonth = (year === startYear) ? startDate.getMonth() : 0;
            const endMonth = (year === endYear) ? endDate.getMonth() : 11;

            for (let month = startMonth; month <= endMonth; month++) {
                const workingDaysInMonth = getWorkingDaysInMonth(year, month, holiday);

                workingDaysInMonth.forEach(date => {
                    if (date >= startDate && date <= endDate) {
                        workingDaysCount++;
                    }
                });
            }
            if (leaveStartDate, leaveEndDate, holidays) {
                getWorkingDaysBetweenDates(leaveStartDate, leaveEndDate, holidays)
            }
        }
        return workingDaysCount;
    };

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const isHoliday = (date) => {
        return formattedHolidays.some(holiday =>
            holiday.date.getDate() === date.getDate() &&
            holiday.date.getMonth() === date.getMonth()
        );
    };

    const currentYear = new Date().getFullYear();

    const formattedHolidays = holidays.map(holiday => {
        const [day, month] = holiday.date.split('/');
        const date = new Date(currentYear, month - 1, day);
        return { ...holiday, date };
    });


    const getWorkingDaysInMonth = (year, month) => {

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const workingDays = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);

            if (!isWeekend(date) && !isHoliday(date)) {
                workingDays.push(date);
            }
        }

        return workingDays;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        if (leaveStartDate && leaveEndDate) {
            console.log("leaveStartDate: ", leaveStartDate, "leaveEndDate: ", leaveEndDate); // Debugging

            // Convert to Date objects
            const startDate = new Date(leaveStartDate);
            const endDate = new Date(leaveEndDate);

            // Log the converted Date objects
            console.log("Converted startDate: ", startDate, "endDate: ", endDate);

            // Check if the conversion was successful
            if (!isNaN(startDate) && !isNaN(endDate)) {
                const result = getWorkingDaysBetweenDates(startDate, endDate, holidays);
                setWorkingDays(result);
                console.log("Result: ", result);
            } else {
                console.error("Invalid date format or unable to parse date");
            }
        }
    }, [leaveStartDate, leaveEndDate, holidays]);

    const applyAnnualLeave = () => {

        const empID = localStorage.getItem('userID');
        const email = localStorage.getItem('email');
        const roleID = localStorage.getItem('roleID');
        const date = Date.now();
        const startDate = leaveStartDate;
        const endDate = leaveEndDate;
        const daysRequired = workingDays
        const leave = 'Annual Leave';

        const message = {
            empID,
            email,
            roleID,
            datee: formatDate(date),
            startDate,
            endDate,
            leave,
            daysRequired,
            selectedSupervisor
        };

        socket.emit("Employee_Leave_Message_Supervisor(1)", message);
    };

    const applyMaternityLeave = () => {
        const empID = localStorage.getItem('userID');
        const email = localStorage.getItem('email');
        const roleID = localStorage.getItem('roleID');
        const date = Date.now();
        const startDate = leaveStartDate;
        const endDate = leaveEndDate;
        const daysRequired = workingDays
        const leave = 'Maternity Leave';

        const message = {
            empID,
            email,
            roleID,
            datee: formatDate(date),
            startDate,
            endDate,
            leave,
            daysRequired,
            selectedSupervisor
        };

        socket.emit("Employee_Leave_Message_Supervisor(1)", message);
    };

    const applySickLeave = () => {
        const empID = localStorage.getItem('userID');
        const email = localStorage.getItem('email');
        const roleID = localStorage.getItem('roleID');
        const date = Date.now();
        const startDate = leaveStartDate;
        const endDate = leaveEndDate;
        const daysRequired = workingDays
        const leave = 'Sick Leave';

        const message = {
            empID,
            email,
            roleID,
            datee: formatDate(date),
            startDate,
            endDate,
            leave,
            daysRequired,
            selectedSupervisor
        };

        socket.emit("Employee_Leave_Message_Supervisor(1)", message);
    };

    const applyIncidental = () => {
        const empID = localStorage.getItem('userID');
        const email = localStorage.getItem('email');
        const roleID = localStorage.getItem('roleID');
        const date = Date.now();
        const startDate = leaveStartDate;
        const endDate = leaveEndDate;
        const daysRequired = workingDays
        const leave = 'Incidental Leave';

        const message = {
            empID,
            email,
            roleID,
            datee: formatDate(date),
            startDate,
            endDate,
            leave,
            daysRequired,
            selectedSupervisor
        };

        socket.emit("Employee_Leave_Message_Supervisor(1)", message);
    };



    return (
        <div>
            <Navbar></Navbar>
            <div className="leave-container">
                <div style={leaveDiv}>
                    <div style={ButtonImages}>
                        <button className='buttonP' onClick={() => openAnnualLeaveModal()}>  <img src={Annual_Leave} style={{ width: '65%', objectFit: 'cover', maxHeight: '50vh', borderRadius: '12px' }} /> </button>
                        <button className='buttonP' onClick={() => openMaternityLeaveModal()}>  <img src={Maternity_leave} style={{ width: '65%', objectFit: 'cover', maxHeight: '50vh', borderRadius: '12px' }} /> </button>
                        <button className='buttonP' onClick={() => openSickLeaveModal()}>  <img src={Sick_Leave} style={{ width: '65%', objectFit: 'cover', maxHeight: '50vh', borderRadius: '12px' }} /> </button>
                        <button className='buttonP' onClick={() => openIncidentalModal()}>  <img src={Incidental_leave} style={{ width: '65%', objectFit: 'cover', maxHeight: '50vh', borderRadius: '12px' }} /> </button>
                    </div>
                </div>

                <Modal isOpen={isAnnualLeaveOpen} onRequestClose={closeAnnualLeaveModal} style={modal}>
                    <div style={{ width: '100%', flexDirection: 'column', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center' }}>
                            <h1>Apply Annual Leave</h1>
                        </div>
                        <img src={Waves} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh' }} />

                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'inline', gap: '12px', justifyContent: 'center' }}>
                            <p>From: </p> <input type='date' name='leave_start_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                            <p>To:</p> <input type='date' name='leave_end_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                            <p>Days Applied: {workingDays} </p>
                        </div>
                        <br />
                        <div>
                            <Select
                                options={supervisor}
                                styles={customStyle}
                                placeholder="Select Supervisor"
                                onChange={handleSupervisorChange}
                            />
                        </div>
                        <br />
                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'inline', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => applyAnnualLeave()}>Apply</button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={isMaternityLeaveOpen} onRequestClose={closeMaternityLeaveModal} style={modal}>
                    <div style={{ width: '100%', flexDirection: 'column', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center' }}>
                            <h1>Apply Maternity Leave</h1>
                        </div>
                        <img src={Motherhood} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', marginTop: '9px', marginBottom: '9px' }} />

                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'inline', gap: '12px', justifyContent: 'center' }}>
                            <p>From: </p> <input type='date' name='leave_start_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                            <p>To:</p> <input type='date' name='leave_end_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                            <p>Days Applied:  {workingDays} </p>
                        </div>
                        <br />
                        <div>
                            <Select
                                options={supervisor}
                                styles={customStyle}
                                placeholder="Select Supervisor"
                                onChange={handleSupervisorChange}
                            />
                        </div>
                        <br />
                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'inline', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => applyMaternityLeave()}>Apply</button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={isSickLeaveModalOpen} onRequestClose={closeSickLeaveModal} style={modal}>
                    <div style={{ width: '100%', flexDirection: 'column', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center' }}>
                            <h1>Apply Sick Leave</h1>
                        </div>
                        <img src={Sick} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh', marginTop: '9px', marginBottom: '9px' }} />

                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'inline', gap: '12px', justifyContent: 'center' }}>
                            <p>From: </p> <input type='date' name='leave_start_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                            <p>To:</p> <input type='date' name='leave_end_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                            <p>Days Applied:  {workingDays} </p>
                        </div>
                        <br />
                        <div>
                            <Select
                                options={supervisor}
                                styles={customStyle}
                                placeholder="Select Supervisor"
                                onChange={handleSupervisorChange}
                            />
                        </div>
                        <br />
                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'inline', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => applySickLeave()}>Apply</button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={isIncidentalLeaveModal} onRequestClose={closeIncidentalLeaveModal} style={modal}>
                    <div style={{ width: '100%', flexDirection: 'column', backgroundColor: 'rgb(206, 206, 236)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', justifyContent: 'center' }}>
                            <h1>Apply Incidental Leave</h1>
                        </div>
                        <img src={Waves} style={{ maxWidth: '90%', objectFit: 'cover', maxHeight: '20vh' }} />

                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'inline', gap: '12px', justifyContent: 'center' }}>
                            <p>From: </p> <input type='date' name='leave_start_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                            <p>To:</p> <input type='date' name='leave_end_date' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                            <p>Days Applied:  {workingDays} </p>
                        </div>
                        <br />
                        <div>
                            <Select
                                options={supervisor}
                                styles={customStyle}
                                placeholder="Select Supervisor"
                                onChange={handleSupervisorChange}
                            />
                        </div>
                        <br />
                        <div style={{ width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'inline', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => applyIncidental()}>Apply</button>
                        </div>
                    </div>
                </Modal>

            </div>
        </div>
    );
}

export default LeaveRequest;
