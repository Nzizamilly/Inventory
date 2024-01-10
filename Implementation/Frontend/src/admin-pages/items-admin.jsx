import { Link } from 'react-router-dom';
import '../style.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'
import axios from 'axios'
import AddItem from '../images/addItem.svg'
import Update from '../images/update.svg'
import Delete from '../images/delete.svg'
import Addy from '../images/addy.svg'
import Info from '../images/info.svg'

function ItemsAdmin() {

  const modalStyles = {
    content: {
      top: '50%',
      width: '70%',
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

  const svgStyle = {
    // backgroundColor: 'green',
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    // marginTop: '2px'
  }

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimpleModalOpen, setIsSimpleModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isSerialModalOpen, setIsSerialModalOpen] = useState(false);
  // const [serialNumber, setSerialNumber] = useState('');
  const [selectedItemID, setSelectedItemID] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen ] = useState(false);
  const [getItems, setGetItems] = useState([])
  const [takenItemId, setTakenItemId] = useState('');


  const openSerialModal = (itemId) => {
    setSelectedItemID(itemId);
    setIsSerialModalOpen(true, itemId);
  };

  const openInfoModal = (itemId) => {
    setSelectedItemID(itemId);
    setIsInfoModalOpen(true);
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
      supplier: '',
      // category: '',
    })
  }

  const [newItem, setNewItem] = useState({
    name: '',
    supplier: '',
    serial_number: ''
    // category: ''
  });

  const handleAddSimpleItemClick = async () => {
    try {
      console.log(newItem);
      const categoryId = selectedCategory;
      // Assuming newItem is an object with properties like name, state_of_item, depreciation_rate, etc.
      await axios.post('http://localhost:5500/add-items', {
        name: newItem.name,
        state_of_item: newItem.state_of_item,
        depreciation_rate: newItem.depreciation_rate,
        supplier: newItem.supplier,
        category: categoryId,
      });

      fetchItemsByCategory(categoryId);
      closeSimpleModal();
    } catch (error) {
      console.error('Error adding Items: ', error);
    }
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

  // const [serialNumberCount, setSerialNumberCount] = useState('')

  const handleAddSerialNumberClick = async (selectedItemID) => {
    console.log("ItemID", selectedItemID);
    const takeItemID = selectedItemID;
    console.log("This has taken ItemID", takeItemID);
    setTakenItemId(takeItemID);
    setSerialNumber(takeItemID);
    setIsSerialModalOpen(true);
    try {
      setSerialNumber({
        ...serialNumber,
        itemID: takeItemID
      });
      await axios.post(`http://localhost:5500/add-serial-number`, serialNumber);
      closeSerialModal();
    } catch (error) {
      console.error('Error adding serial number', error);
    }
  };
  const fetchNumberOfItems = async (selectedItemID) => {
    console.log("ItemID: ", selectedItemID)
    try {
      const response = await axios.get(`http://localhost:5500/serial-number/${selectedItemID}`);
      setGetItems(response.data);
    }catch (error){
      console.error('Error retrieving the items', error);
    }
  };

  const handleCategoryClick = (categoryId,) => {
    setSelectedCategory(categoryId);
    fetchItemsByCategory(categoryId);
    setIsModalOpen(true);
    // fetchNumberOfItems(itemId)
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const [serialNumber, setSerialNumber] = useState({
    serial_number: '',
    state_of_item: '',
    depreciation_rate: '',
    itemID: ''
  });

  const handleSerialNumber = (event) => {
    setSerialNumber((prev)=> ({...prev, [event.target.name]: event.target.value}));
  }

  return (
    <div className='items-container'>
      <div class='item'>
        {categories.map(category => (
          <button key={category.id} onClick={() => handleCategoryClick(category.id, )} className='buttonStyle2'>{category.category_name}</button>
        ))}

        <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
          <h1>Items for category: {selectedCategory}</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>State of item</th>
                <th>Supplier</th>
                <th>Category</th>
                <th>Date Entered</th>
                <th>Edit </th>
                <th>Delete </th>
                <th><button className='addItem-btn' onClick={openSimpleModal}><img src={AddItem} style={svgStyle} /></button></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td> {item.id}</td>
                  <td> {item.name} </td>
                  <td> {item.state_of_item} </td>
                  <td> {item.first_name} </td>
                  <td> {item.category_name} </td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td><button className='addItem-btn'><img src={Update} style={svgStyle} /></button></td>
                  <td><button className='addItem-btn'><img src={Delete} style={svgStyle} /></button></td>
                  <td><button className='addItem-btn' onClick={() => handleAddSerialNumberClick(item.id)}><img src={Addy} style={svgStyle} /></button></td>
                  {/* <td><button className='addItem-btn' onClick={() => openSerialModal(item.id)}><img src={Addy} style={svgStyle} /></button></td> */}
                  <td><button className='addItem-btn' onClick={() => openInfoModal(item.id)}><img src={Info} style={svgStyle} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
        <Modal isOpen={isSimpleModalOpen} onRequestClose={closeSimpleModal} style={modalStyles}>
          <h1>Create A New Item</h1>
          <input placeholder='Name' name='name' type='text' value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          <br />
          <input placeholder='Supplier' name='supplier' type='text' value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} />
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
          {/* <button onClick={() => handleAddSerialNumberClick(selectedCategory)}>Add </button> */}
        </Modal>
        <Modal isOpen={isInfoModalOpen} onRequestClose={closeInfoModal} style={modalStyles}>
          <h1></h1>
          <table>
            <thead>
              <tr>
                <th>Serial Number</th>
                <th>State of item</th>
                <th>Date</th>
                <th>Update</th>
                <the>Delete</the>
              </tr>
            </thead>
            <tbody>
              {getItems.map((itemy)=>(
                <tr key={itemy.id}>
                  <h1>{itemy.itemName}: {itemy.totalSerialCount}</h1>
                  <td>{itemy.serial_number}</td>
                  <td>{itemy.state_of_item}</td>
                  <td>{itemy.date}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      </div>
    </div>
  );
}

export default ItemsAdmin;
