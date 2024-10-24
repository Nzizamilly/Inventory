import '../style.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'
import axios from 'axios'
import AddItem from '../images/addItem.svg'
import Update from '../images/update.svg'
import Delete from '../images/delete.svg'
import Addy from '../images/addy.svg'
import ProfilePicture from '../images/profile-picture.svg';
import Info from '../images/info.svg'
import NavbarAdmin from './navbarAdmin';
import DataTable from 'react-data-table-component';
import HashLoader from "react-spinners/HashLoader";
import io from 'socket.io-client';
import RiseLoader from "react-spinners/RiseLoader";
import FadeLoader from "react-spinners/FadeLoader";
import Keys from '../keys';
import Left from '../images/left-arrow.svg';
import Right from '../images/right-arrow.svg';

function ItemsAdmin() {

  const ioPort = Keys.REACT_APP_SOCKET_PORT;
  const url = Keys.REACT_APP_BACKEND;


  const socket = io.connect(`${ioPort}`);

  socket.on("disconnect", () => {
    console.log("Disconnect from the server");
  });

  const modalStyles = {
    content: {
      top: '50%',
      width: '90%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      borderRadius: '12px',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.9,
      fontFamily: 'Your Custom Font, sans-serif',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      lineHeight: '1.5',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    },
  }

  const itemstyle = {
    width: '70%',
    left: '50%',
    gap: '18px',
    marginBottom: '990px',
    borderRadius: '12px',
    flexWrap: 'wrap',
    display: 'flex',
    backgroundColor: 'rgb(223, 225, 234)',
    padding: '12px 12px'
  };

  const holder = {
    width: '80%',
    height: '85%',
    borderRadius: '12px',
    display: 'flex',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '400px'
  };

  const display = {
    display: 'flex',
    flexDirection: 'inline',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '92px'
  };

  const svgStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '14px',
  }

  const Select = {
    width: '65%',
    height: '78%',
    color: 'black',
    padding: '12px 12px',
    border: 'none',
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '21px'
  };

  const OptionColor = {
    width: '39%',
    height: '55%',
    display: 'flex',
    gap: '12px',
    color: 'white',
    backgroundColor: 'black',
    border: 'none',
    borderRadius: '14px'
  }

  const Dash = {
    color: 'black',
    marginLeft: '90px',
    display: 'flex',
    marginTop: '55px',
    gap: '745px',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const profilePicture = {
    width: '111px',
    height: '86px',
    marginTop: '18px',
    display: 'flex',
    borderRadius: '850px',
    backgroundRolor: 'rgb(0, 255, 255)',
  };
  const buttx = {
    width: '40%',
    height: '60px',
    display: 'flex',
    borderRadius: '30px',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const arrows = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const kindaStyle = {
    content: {
      width: '30%',
      height: '13%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
      gap: '12px',
      borderRadius: '12px',
      backgroundColor: 'rgb(153, 235, 240)',
      marginLeft: '480px',
      marginTop: '320px'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const modal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '25%',
      marginLeft: '495px',
      height: '76vh',
      backgroundColor: 'rgb(94, 120, 138)',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      color: "black",
      padding: '12px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };


  const bulker = {
    color: 'black',
    flexDirection: 'column',
    fontFamily: "'Arial', sans-serif",
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: 'rgb(163, 187, 197)',
    width: '75%',
    marginTop: '3px',
    paddingLeft: '12px',
    borderRadius: '12px',
    height: '97%'
  }


  const modal5 = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '50%', // Adjust the width percentage
      marginLeft: '295px', // Remove or adjust marginLeft
      height: 'auto',
      border: 'none',
      fontFamily: "'Arial', sans-serif",
      borderRadius: '12px',
      gap: '2%', // Remove or adjust gap
      color: 'black',
      // padding: '12px 0px', // Remove or adjust padding
      overflow: 'auto',
      flexDirection: 'column',
      display: 'flex', // Remove if not needed
      // flexDirection: 'column', // Remove if not needed
      // justifyContent: 'center', // Remove if not needed
      alignItems: 'center', // Remove if not needed
    },
  };

  const [animationClass, setAnimationClass] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isListLoaderOpen, setIsListLoaderOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState(Number);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [takenItemId, setTakenItemId] = useState('');
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [takeUpdateId, setTakeUpdateID] = useState(null);

  const [serialNumberForDown, setSerialNumberForDown] = useState('');
  const [getEm, setGetEm] = useState([]);
  const [allSerials, setAllSerials] = useState([])
  const [IDTaken, setIDTaken] = useState();
  const [loading, setLoading] = useState(true);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [getNom, setGetNom] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [isUpdatedOpen, setIsUpdatedOpen] = useState(false);
  const [records, setRecords] = useState(allSerials);
  const [isUpdateSerial, setIsUpdateSerial] = useState(false);
  const [getUpdateSerialID, setGetUpdateSerialID] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [username, setUsername] = useState('');
  const [someCategoryName, setSomeCategoryName] = useState('');
  const [state_of_item_holder, setState_of_item_holder] = useState('');
  const [wholeWord, setWholeWord] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [selectedItemIDForMultipleCreation, setSelectedItemIDForMultipleCreation] = useState(Number);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [handleConfirmID, setHandleConfirmID] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(null);
  const [selectedUpdateSupplier, setSelectedUpdateSupplier] = useState('');
  const [selectedUpdateCategory, setSelectedUpdateCategory] = useState('');
  const [isCreatingNewItemOpen, setIsCreatingNewItemOpen] = useState(false);
  const [isCreatingSerialNumberOpen, setIsCreatingSerialNumberOpen] = useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [takerUserName, setTakerUserName] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [takerModalOpen, isTakerModalOpen] = useState(false);
  const [serialHolder, setSerialHolder] = useState('');
  const [depreciation_rate_holder, setDepreciation_rate_holder] = useState('')
  const [tab, setTab] = useState(1);
  const [requiredAmountBulk, setRequiredAmountBulk] = useState('');
  const [requestorBulk, setRequestorBulk] = useState('')
  const [serialHolderFrom, setSerialHolderFrom] = useState('')
  const [serialHolderTo, setSerialHolderTo] = useState('');
  const [isSomeLoaderOpen, setIsSomeLoaderOpen] = useState(false);
  const [numberToGiveOut, setNumberToGiveOut] = useState('')
  const [serialUpdateData, setSerialUpdateData] = useState({
    serial_number: '',
    state_of_item: '',
    depreciation_rate: '',
  });

  const openSomeLoader = () => {
    setIsSomeLoaderOpen(true);
  }

  const closeSomeLoader = () => {
    setIsSomeLoaderOpen(false);

  }

  const openBulkModal = () => {
    setIsBulkModalOpen(true);
  }

  const closeBulkModal = () => {
    setIsBulkModalOpen(false);
    setInterval(() => {
      setIsListLoaderOpen(false);
    }, 2700);
  };

  const openDeletingItem = (itemID) => {
    handleDelete(itemID);
  };

  const openTakerModal = () => {
    isTakerModalOpen(true)
  };

  const closeTakerModal = () => {
    isTakerModalOpen(false);
  };

  const closeDeletingItem = () => {
    setIsDeletingOpen(false);
  };

  const openCreatingSerialNumber = (takenItemId) => {
    setIsCreatingSerialNumberOpen(true);
    handleAddSerialNumberClick(takenItemId)
  };

  const closeCreatingSerialNumber = () => {
    setIsCreatingSerialNumberOpen(false);
  };

  const openCreatingItem = () => {
    setIsCreatingNewItemOpen(true);
    handleAddSimpleItemClick();
  };

  const closeCreatingNewItem = () => {
    setIsCreatingNewItemOpen(false);
  };

  const openComfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const openWarningModal = () => {
    setIsWarningModalOpen(true);
  };

  const closeWarningModal = () => {
    setIsWarningModalOpen(false)
  };

  const openSerialModal = (itemId) => {
    setSelectedItemIDForMultipleCreation(itemId);
    setIsSerialModalOpen(true);
  };

  const openUpdateModal = (itemID) => {
    setTakeUpdateID(itemID);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openUpdateSerial = (row) => {
    setIsUpdateSerial(true);
    handleSerialUpdate(row);
    setGetUpdateSerialID(row)
  }

  const closeUpdateSerialModal = () => {
    setIsUpdateSerial(false);
  }

  const [selectedItemName, setSeletecteItemName] = useState('')

  const openInfoModal = async (itemId, name) => {
    try {

      setSelectedItemID(itemId);
      setLoadingInfo(true);
      setSeletecteItemName(name)
      fetchNumberOfItemss(itemId);
      fetchNom(itemId);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoadingInfo(false);
    }
    finally {
      setIsInfoModalOpen(true);
      setLoadingInfo(false)
    }
  }

  const handleCategoryClick = (categoryId, category_name) => {
    setSelectedCategory(categoryId);
    setSomeCategoryName(category_name)
    fetchItemsByCategory(categoryId);
    setIsModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setAllSerials([]);
  };

  const closeSerialModal = () => {
    setIsSerialModalOpen(false);
    setSerialNumber('');
    setSelectedItemIDForMultipleCreation('');
    setDepreciation_rate_holder('');
    setState_of_item_holder('');
    setSerialHolderFrom('');
    setSerialHolderTo('');
  };

  const openSimpleModal = () => {
    setIsSimpleModalOpen(true);
  };

  const openListLoader = (employee) => {
    setIsListLoaderOpen(true);
    setTakerUserName(employee.username);
    takeID(employee);
  };

  const openListLoaderForMany = (employee) => {
    setIsListLoaderOpen(true);
    setTakerUserName(username);
    takeIDs(employee);
  };

  const closeListLoader = () => {
    setIsListLoaderOpen(false);
  };


  const closeSimpleModal = () => {
    setIsSimpleModalOpen(false);
    setNewItemName({
      name: '',
      state_of_item: '',
      depreciation_rate: '',
      supplier: selectedSupplier,
    });
  };

  const [newItem, setNewItem] = useState({
    name: '',
    supplier: selectedSupplier,
    category: selectedCategory
  });

  const newItemObj = {
    name: newItem.name,
    supplier: selectedSupplier,
    category: selectedCategory
  }

  const numberOfTabs = 2

  const handlePrev = () => {
    setAnimationClass('slide-left');
    setTab((prev) => (prev > 1 ? prev - 1 : numberOfTabs));
  };

  const handleNext = () => {
    setAnimationClass('slide-right');
    setTab((prev) => (prev < numberOfTabs ? prev + 1 : 1));
  };

  const resetAnimation = () => {
    setAnimationClass('');
  };

  const handleAddSimpleItemClick = async () => {
    try {
      console.log(newItem);
      console.log("Type of category", typeof newItemObj.category);
      console.log("Type of supplier", typeof newItemObj.supplier);
      const categoryId = selectedCategory;
      await axios.post(`${url}/add-items`, newItemObj);

      setInterval(() => {
        setIsCreatingNewItemOpen(false);
      }, 2700);

      fetchItemsByCategory(categoryId);
      closeSimpleModal();
    } catch (error) {
      console.error('Error adding Items: ', error);
    }
  };


  const takeIDs = async (employee) => {
    const requestor = employee.username;
    setRequestorBulk(employee.username);
    const item = selectedItemID;
    const amount = numberToGiveOut;
    setRequiredAmountBulk(amount)
    const employeeID = employee.id;

    try {

      const response = await axios.put(`${url}/change-status-from-notifications-for-bulk/${employeeID}/${item}/${amount}/${employeeID}`);
      const result = response.data;

      if (result === "Given Out") {

        socket.emit("Send Approved Email", employee);

        const responsee = await axios.put(`${url}/change-request-stockStatus/${employeeID}`);
        console.log("Responsee: ", responsee.data);

      } else {
        window.alert("Insuffiencient Amount To Give Out");
      }

      closeBulkModal();

      // setInterval(() => {
      //   setIsListLoaderOpen(false);
      // }, 2700);

    } catch (error) {
      console.error("Error: ", error);
    };
  }


  const handleSendMultipleSerials = async () => {
    try {
      const numbers = [];
      const wholeWordArray = [];

      for (let i = serialHolderFrom; i >= serialHolderTo; i--) {
        numbers.push(i);
      }

      numbers.forEach((number) => {
        const take = serialHolder + ' ' + number;
        wholeWordArray.push(take);
      });

      await axios.post(`${url}/add-serial-holder/${selectedItemIDForMultipleCreation}/${wholeWordArray}/${depreciation_rate_holder}/${state_of_item_holder}`);

      window.alert("Done!!");
    } catch (error) {
      console.error("Error", error);
    }
  };


  // console.log("Whole Word: ", wholeWord);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${url}/category`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };
    fetchCategories();
  }, []);


  const fetchItemsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${url}/items?category=${categoryId}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items: ', error);
    }
  };

  const handleAddSerialNumberClick = async (selectedItemID) => {
    console.log("ItemID", selectedItemID);
    const takeItemID = selectedItemID;
    console.log("takeItemID", takeItemID)
    setTakenItemId(takeItemID);
    setSerialNumber(takeItemID);
    setIsSerialModalOpen(true);
    try {
      setSerialNumber({
        ...serialNumber,
        itemID: takeItemID
      });
      console.log("Check...", serialNumber);
      const response = await axios.post(`${url}/add-serial-number/${takeItemID}`, serialNumber);
      console.log("Response: ", response.data);

      setInterval(() => {
        setIsCreatingSerialNumberOpen(false);
      }, 2700);
      closeSerialModal();
    } catch (error) {
      console.error('Error adding serial number', error);
    };
  };




  const fetchNumberOfItemss = async (itemID) => {
    try {
      console.log("Hitt::::::: ");

      const response = await axios.get(`${url}/get-serial-number/${itemID}`);
      const result = response.data;

      setAllSerials(result);

      console.log("Results: ", result);
    

    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  console.log("All series: ", allSerials);

  const fetchNom = async (itemID) => {
    try {
      const response = await axios.get(`${url}/get-name-serial-number/${itemID}`);
      const result = await response.data;
      setGetNom(result);
    } catch (error) {
      console.error('Error fetching Nom: ', error);
    };
  };

  const [serialNumber, setSerialNumber] = useState({
    serial_number: '',
    state_of_item: '',
    depreciation_rate: '',
    itemID: '',
  });

  const handleSerialNumber = (event) => {
    setSerialNumber((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const employeeIDForBackend = localStorage.getItem('userID');

  const [update, setUpdate] = useState({
    newItemName: '',
    employeeID: employeeIDForBackend
  });

  const handleUpdateInput = (event) => {
    setUpdate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const HandleConfirm = async (itemID) => {

    const employeeID = localStorage.getItem('userID');

    const responsee = await axios.post(`${url}/insert-deletion-doer/${itemID}/${employeeID}`);
    const response = await axios.delete(`${url}/delete-item/${itemID}`);
    setIsDeletingOpen(true);
    setIsConfirmModalOpen(false);


    setInterval(() => {
      setIsDeletingOpen(false);
    }, 2700);

  };

  const handleDelete = async (itemID) => {
    openComfirmModal();
    setHandleConfirmID(itemID);
  };

  const employeeUpdateName = localStorage.getItem('username')

  useEffect(() => {
    setUpdate(prevUpdate => ({
      ...prevUpdate,
      newSupplierID: selectedUpdateSupplier,
      newCategoryID: selectedUpdateCategory,
      employeeUpdateName: employeeUpdateName
    }))
  }, [selectedUpdateSupplier, selectedUpdateCategory]);


  const openUpdateItem = (itemID) => {
    setIsUpdatedOpen(true);
    handleUpdateClick(itemID);
  };

  const closeUpdateItem = () => {
    setIsUpdatedOpen(false);
  }

  const handleUpdateClick = async (itemID) => {
    try {
      console.log("Updaties:", update);
      const response = await axios.put(`${url}/update-item/${itemID}`, update);
      console.log(response);
      const employeeID = localStorage.getItem('userID')
      const responsee = await axios.post(`${url}/insert-doer/${itemID}/${employeeID}`);
      console.log("The post responsee was made", responsee);
      closeUpdateModal();

      setInterval(() => {
        closeUpdateItem();
      }, 2700);

    } catch (error) {
      console.error('Error fetching items: ', error);
    };
  };

  const takeID = async (employee) => {
    const status = 'Out';
    const taker = employee.username;
    const id = employee.id

    setUsername(taker);

    const messageData = {
      name: selectedItemName,
      email: employee.email,
    };

    socket.emit("Send Approved Email", messageData);

    const response = await axios.put(`${url}/update-serial-status/${IDTaken}/${status}/${id}`);
    const result = response.data;
    const message = 'Successfully Updated!!!'

    if (result === message) {
      openInfoModal(selectedItemID, selectedItemName);
    };

    setInterval(() => {
      closeListLoader();
    }, 2700);
  };


  const handleSerialStatus = async (row, status, rowss) => {

    if (status === 'Out') {
      const status = 'In';
      try {

        openSomeLoader();

        const response = await axios.put(`${url}/update-serial-status/${row}/${status}`);
        const result = response.data;
        const message = 'Successfully Updated!!!'
        if (result === message) {
          openInfoModal(selectedItemID, selectedItemName);
        }

        setIsSomeLoaderOpen(false);


      } catch (error) {
        console.error("Error", error);
      };

    } else if (status === 'In') {

      try {
        setIDTaken(row);
        openTakerModal();
        setSerialNumberForDown(rowss.serial_number);
        console.log("Username Going: ", username);
      } catch (error) {
        console.error("Error", error);
      };
    } else {
      console.error("Error In Transfer");
    };
  };


  const columns = [
    {
      name: 'Serial Number',
      selector: row => row.serial_number
    },
    {
      name: 'State of Item',
      selector: row => row.state_of_item

    },
    {
      name: 'Depreciation Rate',
      selector: row => row.depreciation_rate
    },
    {
      name: 'Date',
      selector: row => formatDate(row.date)

    },
    {
      name: 'Update',
      cell: row => (
        <button className='addItem-btn' onClick={() => openUpdateSerial(row.id)}><img src={Update} style={svgStyle} /></button>
      )

    },
    {
      name: 'Delete',
      cell: row => (
        <button className='addItem-btn' onClick={() => handleSerialDelete(row)}><img src={Delete} style={svgStyle} /></button>
      )
    },
    {
      name: 'Take Out or In',
      cell: row => (
        <button className={`status-btn ${row.status === 'In' ? 'green-btn' : 'red-btn'}`} onClick={() => handleSerialStatus(row.id, row.status, row)} >{row.status}</button>
      )
    },
  ];

  const one = [
    {
      name: 'ID',
      selector: row => row.id
    },
    {
      name: 'Name',
      selector: row => row.name
    },
    {
      name: 'Supplier',
      selector: row => row.first_name
    },
    {
      name: 'Created At',
      selector: row => formatDate(row.createdAt)
    },
    {
      name: 'Updated At',
      selector: row => row.updatedtime
    },
    {
      name: 'Updated By',
      selector: row => row.nameUpdated
    },
    {
      name: 'Edit',
      selector: row => (
        <button className='addItem-btn' onClick={() => openUpdateModal(row.id)}><img src={Update} style={svgStyle} /></button>
      )
    },
    {
      name: 'Delete',
      selector: row => (
        <button className='addItem-btn' onClick={() => openDeletingItem(row.id)}><img src={Delete} style={svgStyle} /></button>
      ),
    },
    {
      name: 'Add Item',
      selector: row => (
        <button className='addItem-btn' onClick={() => openSerialModal(row.id)}><img src={Addy} style={svgStyle} /></button>
      ),
    },
    {
      name: 'Serial Numbers',
      selector: row => (
        <button className='addItem-btn' onClick={() => openInfoModal(row.id, row.name)}><img src={Info} style={svgStyle} /></button>
      ),
    },
  ];



  const handleSerialUpdateInput = (event) => {
    setSerialUpdateData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSerialUpdate = async (getUpdateSerialID) => {
    try {
      const response = await axios.put(`${url}/update-serial-item/${getUpdateSerialID}`, serialUpdateData);
      window.alert("Updated successfully");
      console.log(response);
      closeUpdateSerialModal();
    } catch (error) {
      console.error('Error fetching updating: ', error);
    }
  }

  const handleSerialDelete = async (row) => {
    try {
      if (row.status === "Out") {
        openWarningModal();
      } else {
        const response = await axios.delete(`${url}/delete-serial-item/${row.id}`);
        console.log("Response from deletion ", response.data);
      }

    } catch (error) {
      console.error('Error fetching items: ', error);
    }
  };

  useEffect(() => {
    const supplierG = async () => {
      try {

        const response = await axios.get(`${url}/supplier`);
        setSupplier(response.data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    supplierG();
  }, [])

  const handleSupplierChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN", typeof selectedValue);
    setSelectedSupplier(event.target.value);
  }

  const handleUpdateSupplierChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedUpdateSupplier(selectedValue);
  };

  const handleUpdateCategoryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedUpdateCategory(selectedValue);
  };

  const handleFilter = (event) => {
    const newData = categories.filter((row) => {
      return row.category_name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setFilteredCategories(newData);
  };

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);


  const [filteredSerialNumbers, setFilteredSerialNumbers] = useState([]);

  const handleFilterSerial = (event) => {
    const newData = allSerials.filter((row) => {
      return row.serial_number.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setFilteredSerialNumbers(newData);
  };

  useEffect(() => {
    setFilteredSerialNumbers(allSerials);
  }, [allSerials]);

  useEffect(() => {
    setRecords(getEm);
  }, [getEm]);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      const response = await axios.get(`${url}/get-employees-4-items`);
      setAllEmployees(response.data);
    };
    fetchAllEmployees()
  }, []);


  const handleFilterX = (event) => {
    const newData = allEmployees.filter((row) => {
      return row.username.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setFilteredEmployees(newData);
  };

  const handleFilterY = (event) => {
    const newData = allEmployees.filter((row) => {
      return row.username.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setFilteredEmployees(newData);
  };

  const [filteredEmployeesBulk, setFilteredEmployeesBulk] = useState([]);

  useEffect(() => {
    setFilteredEmployeesBulk(allEmployees);
  }, [allEmployees]);

  useEffect(() => {
    setFilteredEmployees(allEmployees);
  }, [allEmployees])


  return (
    <div>
      <NavbarAdmin></NavbarAdmin>
      <div className='items-container'>
        <div style={Dash}>
          <h1>Items</h1>
          <input type='text' placeholder='Search by Category...' onChange={handleFilter} />
        </div>

        <div style={itemstyle}>
          {filteredCategories.map(category => (
            <button key={category.id} onClick={() => handleCategoryClick(category.id, category.category_name)} className='buttonStyle2'>{category.category_name}</button>
          ))}

          <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
            <div style={display}>
              <h1>Items for {someCategoryName}</h1>
              <button className='addItem-btn' onClick={() => openSimpleModal()}><img src={AddItem} style={svgStyle} /></button>
            </div>

            <DataTable
              columns={one}
              data={items}
              pagination
            ></DataTable>
          </Modal>

          <Modal isOpen={isUpdateModalOpen} onRequestClose={closeUpdateModal} style={modalStyles}>
            <div style={{ width: '95%', alignItems: 'center', justifyContent: 'center', height: '64%', display: 'flex', flexDirection: 'column' }}>

              <h1>Update Items</h1>
              <input placeholder='Name' name='newItemName' type='text' onChange={handleUpdateInput} />

              <br />

              <select onChange={handleUpdateSupplierChange} value={selectedUpdateSupplier} style={Select}>
                <option value='' disabled>Select Supplier</option>
                {supplier.map(suppliers => (
                  <option key={suppliers.id} value={suppliers.id} style={OptionColor}>{suppliers.first_name}</option>
                ))}
              </select>

              <br />

              <select onChange={handleUpdateCategoryChange} value={selectedUpdateCategory} style={Select}>
                <option value='' disabled>Select Category</option>
                {categories.map(categories => (
                  <option key={categories.id} value={categories.id} style={OptionColor}>{categories.category_name}</option>
                ))}
              </select>
              <br />
              <br />
              <button onClick={() => openUpdateItem(takeUpdateId)}>Add </button>
            </div>
          </Modal>
          <Modal isOpen={isSimpleModalOpen} onRequestClose={closeSimpleModal} style={modalStyles}>
            <h1>Create A New Item</h1>
            <input placeholder='Name' name='name' type='text' value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            <br />
            <select onChange={handleSupplierChange} value={selectedSupplier} style={Select}>
              <option value='' disabled>Select Supplier </option>
              {supplier.map(suppliers => (
                <option key={suppliers.id} value={suppliers.id} style={OptionColor}>{suppliers.first_name}</option>
              ))}
            </select>
            <br />

            <button onClick={openCreatingItem}>Send</button>
          </Modal>

          <Modal isOpen={isSerialModalOpen} onRequestClose={closeSerialModal} style={modalStyles}>
            <div
              className={animationClass}
              style={holder}
              onAnimationEnd={resetAnimation} // Reset animation class after animation ends
            >
              {tab === 1 && <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                <h1>Add Serial Number For One item</h1>
                <input placeholder='Add Serial Number' name='serial_number' type='text' onChange={handleSerialNumber} />
                <br />
                <input placeholder='State Of Item' name='state_of_item' type='text' onChange={handleSerialNumber} />
                <br />
                <input placeholder='Depreciation Rate' name='depreciation_rate' type='text' onChange={handleSerialNumber} />
                <br />
                <button onClick={() => openCreatingSerialNumber(selectedItemID)}>Add</button>
              </div>
              }

              {tab === 2 && <div style={{ width: '100%', gap: '15px', height: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <h1>Add Serial Number For Multiple Items</h1>


                <input placeholder='Letters before ID' type='text' value={serialHolder} onChange={(e) => setSerialHolder(e.target.value)} />
                <input placeholder='Depreciation Rate' type='text' value={depreciation_rate_holder} onChange={(e) => setDepreciation_rate_holder(e.target.value)} />
                <input placeholder='State of item' type='text' value={state_of_item_holder} onChange={(e) => setState_of_item_holder(e.target.value)} />
                <input placeholder='From (Bigger Number)' type='text' value={serialHolderFrom} onChange={(e) => setSerialHolderFrom(e.target.value)} />
                <input placeholder='To (Smaller Number)' type='text' value={serialHolderTo} onChange={(e) => setSerialHolderTo(e.target.value)} />
                <button onClick={() => handleSendMultipleSerials()}>Send</button>

              </div>
              }

            </div>

            <div style={{ width: '100%', height: '10%', backgroundColor: 'white', display: 'flex', flexDirection: 'inline', gap: '12px' }}>

              <div style={{ width: '20%', height: '10%', backgroundColor: 'white', display: 'flex', gap: '12px', marginLeft: '700px' }}>
                <button style={buttx} onClick={handlePrev}><img src={Left} style={arrows} /></button>
                <button style={buttx} onClick={handleNext}><img src={Right} style={arrows} /></button>
              </div>
            </div>

          </Modal>

          <Modal isOpen={isInfoModalOpen} onRequestClose={closeInfoModal} style={modalStyles}>
            <h1>
              {getNom.length > 0 ? <span>{getNom[0].itemName} : {allSerials.length} </span> : "Loading..."}
            </h1>
            <div style={{ width: '70%', display: 'flex', justifyContent: 'center', gap: '12px', flexDirection: 'inline' }}>
              <input type='text' placeholder='Search By Serial Number' onChange={handleFilterSerial} />
              <button onClick={() => openBulkModal()}>Bulk</button>
            </div>
            <br />
            <DataTable
              columns={columns}
              data={filteredSerialNumbers}
              pagination
            ></DataTable>
          </Modal>
          <Modal isOpen={isUpdateSerial} onRequestClose={closeUpdateSerialModal} style={modalStyles}>{handleSerialUpdateInput}
            <h1>Update</h1>
            <input type='text' placeholder='Serial Number' name='serial_number' onChange={handleSerialUpdateInput} />
            <br />
            <input type='text' placeholder='State Of Item' name='state_of_item' onChange={handleSerialUpdateInput} />
            <br />
            <input type='text' placeholder='Depreciation Rate' name='depreciation_rate' onChange={handleSerialUpdateInput} />
            <br />
            <button onClick={() => handleSerialUpdate(getUpdateSerialID)}>Update</button>
          </Modal>
          <Modal style={kindaStyle} isOpen={isWarningModalOpen} onRequestClose={closeWarningModal}>
            <p>Admin Can't Delete an Item Which is Out</p>
          </Modal>
          <Modal isOpen={isConfirmModalOpen} onRequestClose={closeConfirmModal} style={kindaStyle}>
            <span>Are You Sure You Want To Delete this Item ?</span>
            <br />
            <button onClick={() => HandleConfirm(handleConfirmID)}>Yes</button>
          </Modal>
          <Modal isOpen={isCreatingNewItemOpen} onRequestClose={closeCreatingNewItem} className={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <HashLoader color={'green'} loading={loading} size={59} />
              <div>
                <br />
                <p>Creating A New Item...</p>
              </div>
            </div>
          </Modal>
          <Modal isOpen={isCreatingSerialNumberOpen} onRequestClose={closeCreatingSerialNumber} className={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <HashLoader color={'blue'} loading={loading} size={59} />
              <div>
                <br />
                <p>Assigning A New Serial Number To Item...</p>
              </div>
            </div>
          </Modal>

          <Modal isOpen={isDeletingOpen} onRequestClose={closeDeletingItem} className={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <HashLoader color={'red'} loading={loading} size={59} />
              <div>
                <br />
                <p>Deleting Item & It's Serial Numbers...</p>
              </div>
            </div>
          </Modal>

          <Modal isOpen={isUpdatedOpen} onRequestClose={closeUpdateItem} className={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <HashLoader color={'cyan'} loading={loading} size={59} />
              <div>
                <br />
                <p>Updating Info About Selected Item...</p>
              </div>
            </div>
          </Modal>

          <Modal isOpen={takerModalOpen} onRequestClose={closeTakerModal} style={modal5}>
            <div style={{ float: 'left', width: '69%', height: '60%', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
              <input style={{ marginTop: '15px' }} type='text' placeholder='Search For An Employee To Give This Item...' onChange={handleFilterX} />
            </div>

            {filteredEmployees.map((employee) => (
              <div style={{ width: '55%', borderRadius: '12px', height: '24%', backgroundColor: 'rgb(220, 239, 248)', gap: '5px', display: 'flex', flexDirection: 'inline' }}>
                <img src={ProfilePicture} style={profilePicture} />
                <br />
                <div style={bulker}>
                  <p>Name: {employee.username}</p>
                  <p>Position: {employee.role_name}</p>
                  <p>Department: {employee.department_name}</p>
                  <p>Address: {employee.address}</p>
                  <p>Email: {employee.email}</p>
                  <button onClick={() => { openListLoader(employee) }} style={{ backgroundColor: 'rgb(106, 112, 220)', color: 'whire', display: 'flex', width: '25%', justifyContent: 'center' }}>Give Out</button>
                </div>
              </div>
            ))}
          </Modal>

          <Modal isOpen={isListLoaderOpen} onRequestClose={closeListLoader} className={modal} >
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center' }}>
              <RiseLoader color={'#3444e5'} loading={loading} size={19} />
              <div style={{ fontFamily: 'sans-serif' }}>
                <br />
                <p>Giving {serialNumberForDown || requiredAmountBulk} to {username || requestorBulk}...</p>
              </div>
            </div>
          </Modal>

          <Modal isOpen={isSomeLoaderOpen} onRequestClose={closeSomeLoader} className={modal} >
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <FadeLoader color={'#1adf4f'} loading={loading} size={11} />
              <div style={{ fontFamily: 'sans-serif' }}>
                <br />
                <p>Please Wait...</p>
              </div>
            </div>
          </Modal>


        </div>

        <Modal isOpen={isBulkModalOpen} onRequestClose={closeBulkModal} style={modal5}>
          <div style={{ gap: '90px' }}>
            <h1>Give Out Multiple Items</h1>
            <input type='text' placeholder='Number' onChange={(e) => setNumberToGiveOut(e.target.value)} />
            <p style={{ marginLeft: '8px' }}>To</p>
            <input style={{ width: '85%' }} type='text' placeholder='Search For An Employee To Give This Item...' onChange={handleFilterX} />
          </div>


          {filteredEmployees.map((employee) => (
            <div style={{ width: '55%', borderRadius: '12px', height: '24%', backgroundColor: 'rgb(220, 239, 248)', gap: '5px', display: 'flex', flexDirection: 'inline' }}>
              <img src={ProfilePicture} style={profilePicture} />
              <br />
              <div style={bulker}>
                <p>Name: {employee.username}</p>
                <p>Position: {employee.role_name}</p>
                <p>Department: {employee.department_name}</p>
                <p>Address: {employee.address}</p>
                <p>Email: {employee.email}</p>
                <button onClick={() => { openListLoaderForMany(employee) }} style={{ backgroundColor: 'rgb(106, 112, 220)', color: 'white', display: 'flex', width: '25%', justifyContent: 'center' }}>Give Out</button>
              </div>
            </div>
          ))}

        </Modal>
      </div>
    </div>
  );
}

export default ItemsAdmin;
