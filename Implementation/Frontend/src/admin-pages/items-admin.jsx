import '../style.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'
import axios from 'axios'
import AddItem from '../images/addItem.svg'
import Update from '../images/update.svg'
import Delete from '../images/delete.svg'
import Addy from '../images/addy.svg'
import Info from '../images/info.svg'
import NavbarAdmin from './navbarAdmin';
import DataTable from 'react-data-table-component';
import Multiselect from 'multiselect-react-dropdown';
import { Socket } from 'socket.io-client';

function ItemsAdmin() {


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
    display: 'flex',
    padding: '12px 12px'
  }

  const svgStyle = {
    // backgroundColor: 'green',
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    // marginTop: '2px'
  }
  const inano = {
    color: 'black'
  }

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
  const [getEm, setGetEm] = useState([]);
  const [getNom, setGetNom] = useState([]);
  const [records, setRecords] = useState(getEm);
  const [isUpdateSerial, setIsUpdateSerial] = useState(false);
  const [getUpdateSerialID, setGetUpdateSerialID] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [searchInput, setSeachInput] = useState('');
  const [someCategoryName, setSomeCategoryName] = useState('')
  const [supplier, setSupplier] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(null);
  const [confirm, setConfirmed] = useState(null);
  const [forDown, setForDown] = useState(null);

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
    setIsSerialModalOpen(true, itemId);
    handleAddSerialNumberClick(itemId)
  };

  const openUpdateModal = (itemID) => {
    setTakeUpdateID(itemID);
    setIsUpdateModalOpen(true);
    handleUpdateClick(itemID)
  }

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  }

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
      // setIsInfoModalOpen(true);
      // setLoadingInfo(false)
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoadingInfo(false);
    }
    finally {
      setIsInfoModalOpen(true);
      setLoadingInfo(false)
    }
  }

  const closeInfoModal = () => {
    setIsInfoModalOpen(false)
  }

  const closeSerialModal = () => {
    setIsSerialModalOpen(false);
    setSerialNumber('')
  }

  const openSimpleModal = () => {
    setIsSimpleModalOpen(true);
  }

  const closeSimpleModal = () => {
    setIsSimpleModalOpen(false);
    setNewItemName({
      name: '',
      state_of_item: '',
      depreciation_rate: '',
      supplier: selectedSupplier,
      // category: '',
    })
  }

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

  // console.log("Selected Supplier ID", selectedSupplier)

  const handleAddSimpleItemClick = async () => {
    try {
      console.log(newItem);
      console.log("Type of category", typeof newItemObj.category);
      console.log("Type of supplier", typeof newItemObj.supplier);
      const categoryId = selectedCategory;
      await axios.post('http://localhost:5500/add-items', newItemObj);


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
        const response = await axios.get('http://localhost:5500/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchItemsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:5500/items?category=${categoryId}`);
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
      console.log("Check...", serialNumber)
      await axios.post(`http://localhost:5500/add-serial-number/${takeItemID}`, serialNumber);
      closeSerialModal();
    } catch (error) {
      console.error('Error adding serial number', error);
    }
  };


  const fetchNumberOfItems = async (itemID) => {
    try {
      setLoadingInfo(true);
      const response = await axios.get(`http://localhost:5500/serial-number/${itemID}`);
      const result = await response.data;
      console.log('Fetched data:', result);
      setItemName(result.itemName);
      setSerialNumbers(result.serialNumbers);
      setTotalSerialCount(result.totalSerialCount);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingInfo(false);
    }
  };


  const fetchNumberOfItemss = async (itemID) => {
    try {
      const response = await axios.get(`http://localhost:5500/get-serial-number/${itemID}`);
      const result = await response.data;
      setGetEm(result);
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const fetchNom = async (itemID) => {
    try {
      const response = await axios.get(`http://localhost:5500/get-name-serial-number/${itemID}`);
      const result = await response.data;
      setGetNom(result);
    } catch (error) {
      console.error('Error fetching Nom: ', error)
    }
  }

  const handleCategoryClick = (categoryId, category_name) => {
    setSelectedCategory(categoryId);
    setSomeCategoryName(category_name)
    fetchItemsByCategory(categoryId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const [serialNumber, setSerialNumber] = useState({
    serial_number: '',
    state_of_item: '',
    depreciation_rate: '',
    itemID: '',
  });

  const handleSerialNumber = (event) => {
    setSerialNumber((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const [update, setUpdate] = useState({
    newItemName: '',
    newSupplierName: '',
    newCategoryName: ''
  })
  const handleUpdateInput = (event) => {
    setUpdate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const HandleConfirm = async (itemID) => {
    // Set the confirmed state to true
    setConfirmed(true);
    setForDown(itemID);
    console.log("ITEMID :", itemID);
  
    if (confirm) {
      try {
        // Make an asynchronous HTTP DELETE request
        const response = await axios.delete(`http://localhost:5500/delete-item/${itemID}`);
        
        // Display a success message
        alert("Item Deleted Successfully");
  
        // Log the response to the console
        console.log(response);
      } catch (error) {
        // Handle errors, e.g., display an error message
        console.error('Error deleting item: ', error);
      } finally {
        // Reset the confirmed state, assuming you want to reset it after the operation
        setConfirmed(null);
  
        // Assuming closeConfirmModal is a function to close the confirmation modal
        closeConfirmModal();
      }
    }
  };
  
  

  const handleDelete = async (itemID) => {
    openComfirmModal();
    HandleConfirm(itemID)
    // if (confirm === true){
    //   console.log("Yes its confirmed");
    //   // try {
    //     const response = await axios.delete(`http://localhost:5500/delete-item/${itemID}`)
    //     alert("Item Deleted Successfully");
    //     console.log(response);
    //   // } catch (error) {
    //     // console.error('Error Deleting Item: ', error);
    //   // };
    // }else if(confirm === ''){
    //   console.log("You need to confirm");
    // }
  };

  const handleUpdateClick = async (itemID) => {
    try {
      const response = await axios.put(`http://localhost:5500/update-item/${itemID}`, update);
      alert("Updated successfully")
      console.log(response);
      closeUpdateModal();
    } catch (error) {
      console.error('Error fetching items: ', error);
    }
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
        <button className={`status-btn ${row.status === 'In' ? 'green-btn' : 'red-btn'}`} onClick={() => handleSerialStatus(row.id, row.status)} style={inano}>{row.status}</button>
      )
    }
  ];

  const handleSerialStatus = async (row, status) => {

    if (status === 'Out') {
      const status = 'In';

      try {
        console.log("Status: ", status);
        console.log("ID: ", row);
        const response = await axios.put(`http://localhost:5500/update-serial-status/${row}/${status}`);
        console.log(response)
      } catch (error) {
        console.error("Error", error);
      }
    } else if (status === 'In') {
      const status = 'Out';
      try {
        const taker = await getUserInput("Enter The employee Taking the item...")
        console.log("Status: ", status);
        console.log("ID: ", row);
        console.log("Taker: ", taker);
        const response = await axios.put(`http://localhost:5500/update-serial-status/${row}/${status}/${taker}`);
        console.log(response)
      } catch (error) {
        console.error("Error", error);
      }
    }

  }

  const getUserInput = (promptText) => {
    return new Promise((resolve) => {
      const userInput = window.prompt(promptText, "");
      resolve(userInput);
    });
  }

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
      name: 'Date',
      selector: row => formatDate(row.createdAt)
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
        <button className='addItem-btn' onClick={() => handleDelete(row.id)}><img src={Delete} style={svgStyle} /></button>
      ),
    },
    {
      name: 'Add Item',
      selector: row => (
        <button className='addItem-btn' onClick={() => openSerialModal(row.id)}><img src={Addy} style={svgStyle} /></button>
      )
    },
    {
      name: 'View',
      selector: row => (
        <button className='addItem-btn' onClick={() => openInfoModal(row.id)}><img src={Info} style={svgStyle} /></button>
      )
    },
  ];

  const [serialUpdateData, setSerialUpdateData] = useState({
    serial_number: '',
    state_of_item: '',
    depreciation_rate: '',

  })

  const handleSerialUpdateInput = (event) => {
    setSerialUpdateData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const handleSerialUpdate = async (getUpdateSerialID) => {
    console.log("ID: ", getUpdateSerialID);
    try {
      const response = await axios.put(`http://localhost:5500/update-serial-item/${getUpdateSerialID}`, serialUpdateData);
      alert("Updated successfully");
      console.log(response);
      closeUpdateSerialModal();
    } catch (error) {
      console.error('Error fetching updating: ', error);
    }

  }

  const handleSerialDelete = async (row) => {
    try {
      if (row.status === "Out") {
        // window.alert("Can not detele an item which is out");
        openWarningModal();
      } else {
        const response = await axios.delete(`http://localhost:5500/delete-serial-item/${row.id}`);
        // alert("Deleted successfully");
        console.log("Response from deletion ", response.data);
      }

    } catch (error) {
      console.error('Error fetching items: ', error);
    }
  }

  function handleFilter(event) {
    const newData = getEm.filter(row => {
      return row.serial_number.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setRecords(newData);
  }

  useEffect(() => {
    setRecords(getEm);
  }, [getEm]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSeachInput(searchTerm);

    const filtered = categories.filter((category) =>
      category.category_name.toLowerCase().includes(searchTerm)
    );
    setFilteredCategories(filtered);
  };

  const display = {
    display: 'flex',
    flexDirection: 'inline',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '92px'
  }

  useEffect(() => {
    const supplierG = async () => {
      const response = await axios.get("http://localhost:5500/supplier");
      const result = response.data;
      // console.log("ALL SUPPLIER'S DATA ", result);
      setSupplier(result);
    }

    supplierG();
  }, [])

  const handleSupplierChange = (event) => {
    const selectedValue = event.target.value;
    console.log("TYPE OF SELECTED VALUE DOWN", typeof selectedValue);
    setSelectedSupplier(selectedValue)
  }

  const Select = {
    width: '43%',
    height: '18%',
    color: 'black',
    border: 'none',
    borderRadius: '21px'
  };

  const OptionColor = {
    width: '39%',
    height: '25%',
    display: 'flex',
    gap: '12px',
    color: 'white',
    backgroundColor: 'black',
    border: 'none',
    borderRadius: '14px'
  }

  const Dash = {
    color: 'black',
    marginLeft: '235px',
    display: 'flex',
    marginTop: '55px',
    gap: '745px',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const kindaStyle = {
    content: {
      width: '30%',
      height: '13%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
      borderRadius: '12px',
      backgroundColor: 'rgb(153, 235, 240)',
      marginLeft: '580px',
      marginTop: '320px'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
 
  return (
    <div>
      <NavbarAdmin></NavbarAdmin>
      <div className='items-container'>
        <div style={Dash}>
          <h1>Items</h1>
          <input type='text' placeholder='Search by Category...' onChange={handleSearch} value={searchInput} />
        </div>
        <div>
          {filteredCategories.map((category) => (
            <button key={category.id}
              onClick={() => handleCategoryClick(category.id)}>{category.name}
            </button>
          ))}
        </div>
        {/* <br /> */}
        <div style={itemstyle}>
          {categories.map(category => (
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
            <h1>Update Items</h1>
            <input placeholder='Name' name='newItemName' type='text' onChange={handleUpdateInput} />
            <br />
            <input placeholder='Supplier' name='newSupplierName' type='text' onChange={handleUpdateInput} />
            <br />
            <input placeholder='Category' name='newCategoryName' type='text' onChange={handleUpdateInput} />
            <br />
            <button onClick={() => handleUpdateClick(takenItemId)}>Add </button>

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
            <button onClick={handleAddSimpleItemClick}>Send</button>
          </Modal>
          <Modal isOpen={isSerialModalOpen} onRequestClose={closeSerialModal} style={modalStyles}>
            <h1>Add Serial Number</h1>
            <input placeholder='Add Serial Number' name='serial_number' type='text' onChange={handleSerialNumber} />
            <br />
            <input placeholder='State Of Item' name='state_of_item' type='text' onChange={handleSerialNumber} />
            <br />
            <input placeholder='Depreciation Rate' name='depreciation_rate' type='text' onChange={handleSerialNumber} />
            <br />
            <button onClick={() => handleAddSerialNumberClick(takenItemId)}>Add </button>
          </Modal>
          <Modal isOpen={isInfoModalOpen} onRequestClose={closeInfoModal} style={modalStyles}>
            <h1>
              {getNom.length > 0 ? <span>{getNom[0].itemName}</span> : "Loading..."}: {totalSerialCount}
            </h1>
            <input type='text' placeholder='Search By Serial Number' onChange={handleFilter} />
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
            <p>Admin Can't Delete an Item Which is out</p>
          </Modal>
          <Modal isOpen={isConfirmModalOpen} onRequestClose={closeConfirmModal} style={kindaStyle}>
            <span>Are You Sure You Want To Delete this Item</span>
            <br />
            <button onClick={()=>HandleConfirm(forDown)}>Yes</button>

          </Modal>
        </div>
      </div >
    </div>
  );
}

export default ItemsAdmin;