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
import Keys from '../keys';

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
  const inano = {
    color: 'black'
  };

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
      width: '23%',
      marginLeft: '495px',
      height: '72vh',
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

  const bulkModal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '43%',
      marginLeft: '385px',
      height: '72vh',
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

  const modal5 = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '50%', // Adjust the width percentage
      marginLeft: '395px', // Remove or adjust marginLeft
      height: 'auto',
      border: 'none',
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

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isListLoaderOpen, setIsListLoaderOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [takenItemId, setTakenItemId] = useState('');
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [takeUpdateId, setTakeUpdateID] = useState(null);
  const [itemName, setItemName] = useState('');
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [totalSerialCount, setTotalSerialCount] = useState(0);
  const [serialNumberForDown, setSerialNumberForDown] = useState('');
  const [getEm, setGetEm] = useState([]);
  const [IDTaken, setIDTaken] = useState();
  const [loading, setLoading] = useState(true);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [getNom, setGetNom] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [isUpdatedOpen, setIsUpdatedOpen] = useState(false);
  const [records, setRecords] = useState(getEm);
  const [isUpdateSerial, setIsUpdateSerial] = useState(false);
  const [getUpdateSerialID, setGetUpdateSerialID] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [username, setUsername] = useState('');
  const [someCategoryName, setSomeCategoryName] = useState('')
  const [supplier, setSupplier] = useState([]);
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
  const [serialUpdateData, setSerialUpdateData] = useState({
    serial_number: '',
    state_of_item: '',
    depreciation_rate: '',
  });

  const openBulkModal = () => {
    setIsBulkModalOpen(true);
  }

  const closeBulkModal = () => {
    setIsBulkModalOpen(false);
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
    setSelectedItemID(itemId);
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

  const openInfoModal = async (itemId) => {
    try {
      setSelectedItemID(itemId);
      setLoadingInfo(true);
      fetchNumberOfItems(itemId);
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
    setIsInfoModalOpen(false)
  };

  const closeSerialModal = () => {
    setIsSerialModalOpen(false);
    setSerialNumber('');
  };

  const openSimpleModal = () => {
    setIsSimpleModalOpen(true);
  };

  const openListLoader = (username) => {
    setIsListLoaderOpen(true);
    setTakerUserName(username);
    takeID(username);
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

  const fetchNumberOfItems = async (itemID) => {
    try {
      setLoadingInfo(true);
      const response = await axios.get(`${url}/serial-number/${itemID}`);
      const result = await response.data;
      console.log('Fetched data:', result);
      setItemName(result.itemName);
      setSerialNumbers(result.serialNumbers);
      setTotalSerialCount(result.totalSerialCount);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingInfo(false);
    };
  };


  const fetchNumberOfItemss = async (itemID) => {
    try {
      const response = await axios.get(`${url}/get-serial-number/${itemID}`);
      const result = await response.data;
      setGetEm(result);
    } catch (error) {
      console.error('Error fetching data: ', error)
    };
  };

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
    console.log(responsee.data);
    const response = await axios.delete(`${url}/delete-item/${itemID}`);
    console.log(response.data);
    console.log("Item was deleted Successfully...");
    setIsDeletingOpen(true);

    setInterval(() => {
      setIsDeletingOpen(false);
    }, 2700);
    console.log("ITEMID :", itemID);

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

  const takeID = async (username) => {
    const status = 'Out';
    const taker = username;
    setUsername(taker);
    console.log("Status: ", status);
    console.log("Taker: ", taker);
    const response = await axios.put(`${url}/update-serial-status/${IDTaken}/${status}/${username}`);
    console.log("Response: ", response.data);

    setInterval(() => {
      closeListLoader();
    }, 2700);
  };

  const handleSerialStatus = async (row, status, rowss) => {

    if (status === 'Out') {
      const status = 'In';
      try {
        console.log("Status: ", status);
        console.log("ID: ", row);
        const response = await axios.put(`${url}/update-serial-status/${row}/${status}`);
        console.log(response);
      } catch (error) {
        console.error("Error", error);
      };

    } else if (status === 'In') {

      try {
        setIDTaken(row);
        openTakerModal();
        setSerialNumberForDown(rowss.serial_number);
        const status = 'Out';
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
        <button className='addItem-btn' onClick={() => openInfoModal(row.id)}><img src={Info} style={svgStyle} /></button>
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
          ))};

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
            <h1>Add Serial Number</h1>
            <input placeholder='Add Serial Number' name='serial_number' type='text' onChange={handleSerialNumber} />
            <br />
            <input placeholder='State Of Item' name='state_of_item' type='text' onChange={handleSerialNumber} />
            <br />
            <input placeholder='Depreciation Rate' name='depreciation_rate' type='text' onChange={handleSerialNumber} />
            <br />
            <button onClick={() => openCreatingSerialNumber(selectedItemID)}>Add</button>
          </Modal>
          <Modal isOpen={isInfoModalOpen} onRequestClose={closeInfoModal} style={modalStyles}>
            <h1>
              {getNom.length > 0 ? <span>{getNom[0].itemName}</span> : "Loading..."}: {totalSerialCount}
            </h1>
            <div style={{ width: '70%', display: 'flex', justifyContent: 'center', gap: '12px', flexDirection: 'inline' }}>
              <input type='text' placeholder='Search By Serial Number' onChange={handleFilter} />
              <button onClick={() => openBulkModal()}>Bulk</button>
            </div>
            <br />
            <DataTable
              columns={columns}
              data={records}
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
          <Modal isOpen={isCreatingNewItemOpen} onRequestClose={closeCreatingNewItem} style={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <HashLoader color={'green'} loading={loading} size={59} />
              <div>
                <br />
                <p>Creating A New Item...</p>
              </div>
            </div>
          </Modal>
          <Modal isOpen={isCreatingSerialNumberOpen} onRequestClose={closeCreatingSerialNumber} style={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <HashLoader color={'blue'} loading={loading} size={59} />
              <div>
                <br />
                <p>Assigning A New Serial Number To Item...</p>
              </div>
            </div>
          </Modal>

          <Modal isOpen={isDeletingOpen} onRequestClose={closeDeletingItem} style={modal}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <HashLoader color={'red'} loading={loading} size={59} />
              <div>
                <br />
                <p>Deleting Item & It's Serial Numbers...</p>
              </div>
            </div>
          </Modal>

          <Modal isOpen={isUpdatedOpen} onRequestClose={closeUpdateItem} style={modal}>
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
                {employee.profile_picture ? <img src={ProfilePicture} style={profilePicture} /> : <img src={employee.profile_picture} alt='profile_Picture' style={profilePicture} />}
                <br />
                <div style={{ color: 'black', flexDirection: 'column', justifyContent: 'center', display: 'flex', backgroundColor: 'rgb(163, 187, 197)', width: '75%', fontFamily: 'san-serif', marginTop: '3px', paddingLeft: '12px', borderRadius: '12px', height: '97%' }}>
                  <p>Name: {employee.username}</p>
                  <p>Position: {employee.role_name}</p>
                  <p>Department: {employee.department_name}</p>
                  <p>Address: {employee.address}</p>
                  <button onClick={() => { openListLoader(employee.username) }} style={{ backgroundColor: 'rgb(106, 112, 220)', color: 'whire', display: 'flex', width: '25%', justifyContent: 'center' }}>Give Out</button>
                </div>
              </div>
            ))}
          </Modal>

          <Modal isOpen={isListLoaderOpen} onRequestClose={closeListLoader} style={modal} >
            <div style={{ display: 'flex', flexDirection: 'column', height: '96vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'none' }}>
              <RiseLoader color={'#3444e5'} loading={loading} size={11} />
              <div style={{ fontFamily: 'sans-serif' }}>
                <br />
                <p>Giving {serialNumberForDown} to {username}...</p>
              </div>
            </div>
          </Modal>
        </div>

        <Modal isOpen={isBulkModalOpen} onRequestClose={closeBulkModal} style={bulkModal}>
          <div>
            <h1>Give Out Multiple Items</h1>
            <input type='text' placeholder='Number' />
            <p>To</p>
            <input type='text' placeholder='Search...' onChange={handleFilterY} />
          </div>

              <div style={{ width: '55%', borderRadius: '12px', height: '34%', backgroundColor: 'rgb(220, 239, 248)', gap: '5px', display: 'flex', flexDirection: 'inline' }}>
                {filteredEmployeesBulk.profile_picture ? <img src={ProfilePicture} style={profilePicture} /> : <img src={filteredEmployeesBulk.profile_picture} alt='profile_Picture' style={profilePicture} />}
                <br />
                <div style={{ color: 'black', flexDirection: 'column', justifyContent: 'center', display: 'flex', backgroundColor: 'rgb(163, 187, 197)', width: '75%', fontFamily: 'san-serif', marginTop: '3px', paddingLeft: '12px', borderRadius: '12px', height: '97%' }}>
                  <p>Name: {filteredEmployeesBulk.username}</p>
                  <p>Position: {filteredEmployeesBulk.role_name}</p>
                  <p>Department: {filteredEmployeesBulk.department_name}</p>
                  <p>Address: {filteredEmployeesBulk.address}</p>
                  <button onClick={() => { openListLoader(filteredEmployeesBulk.username) }} style={{ backgroundColor: 'rgb(106, 112, 220)', color: 'whire', display: 'flex', width: '25%', justifyContent: 'center' }}>Give Out</button>
                </div>
              </div>

        </Modal>
      </div>
    </div>
  );
}

export default ItemsAdmin;
