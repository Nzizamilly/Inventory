
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
    const [leaveBeforeThisApplication, setLeaveBeforeThisApplication] = useState('');
    const [leaveStartDate, setLeaveStartDate] = useState('');
    const [oneEmployeeID, setOneEmployeeID] = useState(0);
    const [leaveEndDate, setLeaveEndDate] = useState('');
    const [DOE, setDOE] = useState({});
    const [leaveAvailable, setLeaveAvailable] = useState('');
    const [leaveTakenThisYear, setLeaveTakenThisYear] = useState('')
    const [leaveBF, setLeaveBF] = useState(0);

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
        setOneEmployeeID(ID);
        oneEmployeeFunction(ID);
    };

    useEffect(() => {
        const func = async (oneEmployeeID) => {

            try {
                const response = await axios.get(`${url}/get-DOE/${oneEmployeeID}`);
                const get = {
                    month: new Date(response.data.date_of_employment).getMonth() + Number(1),
                    year: new Date(response.data.date_of_employment).getFullYear(),
                }
                setDOE(get);
            } catch (error) {
                console.error("Error: ", error);
            }
        }
        func(oneEmployeeID);
    }, [oneEmployeeID]);

    const [currentDate, setCurrentDate] = useState('');
    const [responseState, setResponseState] = useState('');
    
    useEffect(() => {
        const Dday = new Date().getDate()
        const Mmonth = new Date().getMonth();
        const Yyear = new Date().getFullYear();
    
        const today = `${Dday}/${Mmonth}/${Yyear}`;
        console.log(`Todays Date ${today}`);
        setCurrentDate(today);

        const differenceInMonth = async(DOEMonthx, DOEYearx) => {
            try {
                // const DOEMonthx = DOE.month;
                // const DOEYearx = DOE.year;

                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();

                if (DOEYear === currentYear) {
                    const lastMonth = currentMonth ;
                    const diff = ((Number(lastMonth) - Number(DOEMonth)) * Number(1.5));
                    console.log(`Difference is ${diff}`);
                    setLeaveAvailable(diff);
                    const zero = 0;
                    setLeaveBF(zero);
                } else if (DOEYear !== currentYear) {
                    const January = 1;
                    setLeaveAvailable((Number(currentMonth) - Number(January)) * Number(1.5));
                    const response = await axios.get(`${url}/get-leave-bf/${oneEmployeeID}/${DOEYear}/${currentYear}`);
                    const lastYear = currentYear - 1;
                    console.log("Last Year: ", lastYear);
                    const get = (Number(lastYear) - Number(DOEYear)) * Number(18);
                    console.log(`${lastYear} - ${DOEYear} * 18 = ${get}`);
                    const leaveBF = get - response.data.total_leave_taken_past_years;
                    console.log(`${get} - ${response.data.total_leave_taken_past_years} = ${leaveBF}`)
                    setLeaveBF(leaveBF);

                };
            } catch (error) {
                console.error("Error :", error);;
            }
        };

        const DOEMonth = DOE.month;
        const DOEYear = DOE.year;

        differenceInMonth(DOEMonth, DOEYear, responseState)

    }, [DOE, oneEmployeeID]);

    const closeLeaveModal = () => {
        setLeaveAvailable('');
        setLeaveBF('');
        setWorkingDays('');
        setIsLeaveModalOpen(false);
    };

    const handleStartDate = (event) => {
        setLeaveStartDate(event.target.value);
    };

    const handleEndDate = (event) => {
        const selectedEndDate = new Date(event.target.value)
        setLeaveEndDate(selectedEndDate);
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


    const applyLeave = async () => {
        try {
            const applyingYear = leaveEndDate.getFullYear();

            const data = {
                workingDays: workingDays,
                empID: oneEmployeeID,
                applyingYear: applyingYear
            };

            if (leaveBeforeThisApplication >= workingDays) {
                window.alert(`${oneEmployee[0].username} will be on leave of ${workingDays}`);
                // const response = await axios.post(`${url}/take-needed-days`, data);
            } else {
                window.alert(`${oneEmployee[0].username} hasn't earned ${workingDays} days.`);
            }

        } catch (error) {
            console.error("Error", error)
        }
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


    useEffect(() => {
        const func = async (oneEmployeeID) => {
            try {
                const currentYear = new Date().getFullYear();

                const response = await axios.get(`${url}/get-leave-taken/${oneEmployeeID}/${currentYear}`);
                setLeaveTakenThisYear(response.data.total_leave_taken_in_current_year);

            } catch (error) {
                console.error("Error: ", error)
            }
        };

        func(oneEmployeeID);
    }, [oneEmployeeID]);

    useEffect(() => {
        const func = (leaveBFI3, leaveAva3ilable) => {
            try {
                const sum = Number(leaveBF) + Number(leaveAvailable);
                setLeaveBeforeThisApplication(sum);

            } catch (error) {
                console.error("Error: ", error);
            }
        };
        func(leaveBF, leaveAvailable)
    }, [leaveBF, leaveAvailable]);

    useEffect(() => {
        const func = () => {
            try{


            }catch(error){
                console.error("Error:", error);
            }
        };
        func();
    },[])

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
                                <div style={{ marginLeft: '12px', display: 'flex', gap: '239px', flexDirection: 'inline' }}>
                                    <p>Date of Employment: {formatDate(employee.date_of_employment)}</p>
                                    <p>Date of Application: {currentDate} </p>
                                </div>
                                <br />

                                <div style={{ width: '100%', height: '40%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', width: '100%' }} >
                                        <h1>Apply For Leave</h1> <button style={{ color: 'black', width: '20%' }} onClick={() => applyLeave()}>Calculate</button>
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
                                            <p>Leave B/F: {leaveBF} </p>
                                        </div>

                                        <br />

                                        <div style={{ width: '70%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave Earned to date : {leaveAvailable} </p>

                                        </div>
                                        <br />

                                        <div style={{ width: '60%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave Balance before this application: {leaveBeforeThisApplication} </p>

                                        </div>

                                    </div>

                                    <div style={{ width: '50%', backgroundColor: 'white' }}>

                                        <div style={{ width: '70%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Annual Entitlement: 18 </p>

                                        </div>
                                        <br />

                                        <div style={{ width: '70%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave Taken This Year: {leaveTakenThisYear} </p>


                                        </div>
                                        <br />

                                        <div style={{ width: '50%', marginLeft: '12px', backgroundColor: 'white', display: 'flex', }}>

                                            <p>Leave balance incl. This application: {(Number(leaveBeforeThisApplication) - Number(workingDays))} </p>

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