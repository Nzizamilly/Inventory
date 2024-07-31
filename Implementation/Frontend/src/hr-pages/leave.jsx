import React, { useState, useEffect } from 'react';
import NavbarMain from './navbarMain';
import Keys from '../keys';
import Modal from 'react-modal';
import axios from 'axios';
import ProfilePicture from '../images/centrika-removebg.png';
// import holidays from 'date-holidays';
import { ref, getDownloadURL, getStorage, } from "firebase/storage";


function LeavePage() {

    const url = Keys.REACT_APP_BACKEND;

    const Container = {
        width: '100%',
        height: '100vh',
        display: 'flex',
        overflow: 'auto',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        // fontFamily: "'Arial', sans-serif",
        backgroundColor: ' rgb(163, 187, 197)',
    };
    const CompanyButton = {
        height: '48%',
        width: '48%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };
    const kain = {
        marginLeft: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(163, 187, 197)',
        paddingTop: '70px',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        color: 'black',
        display: 'flex',
        gap: '12px',
        flexDirection: 'inline'
    };

    const leave = {
        gap: '15px',
        width: '75%',
        // height: '49%',
        border: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        textAlign: 'left',
        padding: '12px 0px',
        marginLeft: '200px',
        // marginTop: '278px',
        paddingLeft: '12px',
        borderRadius: '12px',
        flexDirection: 'inline',
        color: 'rgb(29, 27, 27)',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'rgb(206, 206, 236)',
    };

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
            flexDirection: 'column',
            // justifyContent: 'center',
            // alignItems: 'center',
        },
    }
    const [employees, setEmployees] = useState([]);
    const [employeeImages, setEmployeeImages] = useState({});
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [oneEmployee, setOneEmployee] = useState([]);
    const [workingDays, setWorkingDays] = useState(0);
    const [leaveStartDate, setLeaveStartDate] = useState('');
const [leaveEndDate, setLeaveEndDate] = useState('');

const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

const isHoliday = (date) => {
    return formattedHolidays.some(holiday =>
        holiday.date.getDate() === date.getDate() &&
        holiday.date.getMonth() === date.getMonth()
    );
};

const holidays = [
    {
        name: 'New Years Day',
        date: '1/1/0000'
    },
    {
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

const month = 8; // July (zero-indexed)
const workingDaysInMonth = getWorkingDaysInMonth(currentYear, month);

console.log("Working Days in July 2024:", workingDaysInMonth.map(date => date.toDateString()));



const getWorkingDaysBetweenDates = (startDate, endDate, holiday) => {

    console.log("Received startDate: ", startDate, "endDate: ", endDate); // Debugging

    // Ensure both are Date objects
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        console.error("startDate or endDate is not a valid Date object");
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

}


    const openLeaveModal = (ID) => {
        setIsLeaveModalOpen(true);
        oneEmployeeFunction(ID);
    };

    const closeLeaveModal = () => {
        setIsLeaveModalOpen(false);
    };

    const handleStartDate = (event) => {
        setLeaveStartDate(event.target.value);
    };

    const handleEndDate = (event) => {
        setLeaveEndDate(event.target.value)

    }

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${url}/employees`);
                setEmployees(response.data);

                // Fetch images for each employee
                const storage = getStorage();
                const imageFetches = response.data.map(async (employee) => {
                    const imageRef = ref(storage, `employeesProfilePictures/${employee.id}`);
                    try {
                        const imageURL = await getDownloadURL(imageRef);
                        return { [employee.id]: imageURL };
                    } catch (error) {
                        // console.error(`Error fetching image for employee ${employee.id}: `, error);
                        return { [employee.id]: console.log("No Image") };
                    }
                });

                const images = await Promise.all(imageFetches);
                const imagesMap = Object.assign({}, ...images);
                setEmployeeImages(imagesMap);
            } catch (error) {
                console.error("Error: ", error);
            }

        }
        fetchEmployees();
    }, []);

    const oneEmployeeFunction = async (ID) => {
        const response = await axios.get(`${url}/employee-once/${ID}`);
        setOneEmployee(response.data);
    };

  

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    console.log("Start Date: ", leaveStartDate);
    console.log("End Date: ", leaveEndDate);

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
    

    console.log("Working Days: ", workingDays)


    return (
        <div>
            <NavbarMain></NavbarMain>
            <div style={kain}>
                <h1>Leave Tab</h1>
            </div>
            <div style={Container}>
                <div style={leave}>
                    {employees.map(employee => (
                        <button key={employee.id} style={CompanyButton} onClick={() => openLeaveModal(employee.id)}>
                            {employeeImages[employee.id] ? (
                                <img
                                    src={employeeImages[employee.id]}
                                    alt={`${employee.username} logo`}
                                    style={{ width: '25%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }}
                                />
                            ) : (
                                <img
                                    src={ProfilePicture}
                                    alt="default profile"
                                    style={{ width: '45%', objectFit: 'cover', maxHeight: '20vh', borderRadius: '60px' }}
                                />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <p>Name: {employee.username}</p>
                                <p>Email: {employee.email}</p>
                                <p>Address: {employee.address}</p>
                                <p>PhoneNumber: {employee.phoneNumber}</p>
                                <p>Role: {employee.role_name}</p>
                                <p>{employee.number}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <Modal isOpen={isLeaveModalOpen} onRequestClose={closeLeaveModal} style={modal}>
                    {oneEmployee.map(employee => (
                        <>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <h1>{employee.username}</h1>
                            </div>

                            <div style={{ width: '100%', height: '100%', backgroundColor: 'rgb(206, 206, 236)' }}>
                                <div style={{ marginLeft: '12px' }}>
                                    <p>Date of Employment: {formatDate(employee.date_of_employment)}</p>
                                </div>
                                <br />

                                <div style={{ width: '100%', height: '40%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', width: '100%' }} >
                                        <h1>Apply For Leave</h1>
                                    </div>
                                    <br />
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', width: '100%' }}>
                                        <p> From: </p> <input type='date' name='leave_start_date' id='smallDate' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleStartDate} />
                                        <p>To: </p> <input input type='date' name='leave_end_date' id='smallDate' style={{ width: '20%', borderRadius: '20px', display: 'flex', justifyContent: 'center', border: 'none' }} onChange={handleEndDate} />
                                        <p>Total Days: {workingDays}</p>
                                    </div>
                                </div>

                                <br />

                                <div style={{ width: '100%', backgroundColor: 'green', display: 'flex', flexDirection: 'inline' }}>

                                    <div style={{ width: '50%', backgroundColor: 'white' }}>

                                        <div style={{ width: '60%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave B/F: </p>

                                        </div>
                                        <br />

                                        <div style={{ width: '70%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave Earned to date: </p>

                                        </div>
                                        <br />

                                        <div style={{ width: '60%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave Balance before this application: </p>

                                        </div>

                                    </div>

                                    <div style={{ width: '50%', backgroundColor: 'white' }}>

                                        <div style={{ width: '70%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Annual Entitlement: 18 </p>

                                        </div>
                                        <br />

                                        <div style={{ width: '70%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave Taken This Year: </p>

                                        </div>
                                        <br />

                                        <div style={{ width: '50%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave balance incl. This application: </p>

                                        </div>

                                    </div>
                                </div>



                            </div>
                        </>
                    ))}

                </Modal>
            </div>

        </div>
    );
}

export default LeavePage;
