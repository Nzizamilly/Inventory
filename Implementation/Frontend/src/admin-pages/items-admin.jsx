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
  const [selectedItemID, setSelectedItemID] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [takenItemId, setTakenItemId] = useState('');
  const [loadingInfo, setLoadingInfo] = useState(false)


  const openSerialModal = (itemId) => {
    setSelectedItemID(itemId);
    setIsSerialModalOpen(true, itemId);
  };

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


  const handleAddSerialNumberClick = async (selectedItemID) => {
    console.log("ItemID", selectedItemID);
    const takeItemID = selectedItemID;
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
  const [itemName, setItemName] = useState('');
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [totalSerialCount, setTotalSerialCount] = useState(0);

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

  const [getEm, setGetEm] = useState([]);

  const fetchNumberOfItemss = async (itemID) => {
    try {
      const response = await axios.get(`http://localhost:5500/get-serial-number/${itemID}`);
      const result = await response.data;
      setGetEm(result);
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const [getNom, setGetNom] = useState([]);

  const fetchNom = async (itemID) => {
    try {
      const response = await axios.get(`http://localhost:5500/get-name-serial-number/${itemID}`);
      const result = await response.data;
  
      if (result.length > 0) {
        const itemNameFromResponse = result[0].itemName;
        setGetNom(itemNameFromResponse);
      } else {
        // Handle the case where no item name is found
        setGetNom("Item Name Not Found");
      }
    } catch (error) {
      console.error('Error fetching Nom: ', error);
    }
  };
  

  // const fetchNumberOfItems = async ({itemID}) => {
  //  const [data, setData] = useState(null);
  //  const [loading, setLoading] = useState(true);

  //  useEffect(()=>{
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`/serial-number/${itemID}`);
  //       const result = await response.json();
  //       setData(result);
  //       setLoading(false);
  //     }catch(error){
  //       console.error('Error fetching data:', error)
  //     }
  //   };
  //   fetchData();
  //  }, [itemID]);

  //   if (!data){
  //     return <p>Error loading Data</p>
  //   }

  //  if (loading){
  //   return <p>Loading....</p>;
  //  }
  // }

  // const {itemName, serialNumbers, totalSerialCount } = data


  const handleCategoryClick = (categoryId,) => {
    setSelectedCategory(categoryId);
    fetchItemsByCategory(categoryId);
    setIsModalOpen(true);
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
    setSerialNumber((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  console.log('serialNumbers:', serialNumbers, totalSerialCount, itemName);


  return (
    <div className='items-container'>
      <div class='item'>
        {categories.map(category => (
          <button key={category.id} onClick={() => handleCategoryClick(category.id,)} className='buttonStyle2'>{category.category_name}</button>
        ))}

        <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
          <h1>Items for category: {selectedCategory}</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
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
                  <td> {item.first_name} </td>
                  <td> {item.category_name} </td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td><button className='addItem-btn'><img src={Update} style={svgStyle} /></button></td>
                  <td><button className='addItem-btn'><img src={Delete} style={svgStyle} /></button></td>
                  {/* <td><button className='addItem-btn' onClick={() => handleAddSerialNumberClick(item.id)}><img src={Addy} style={svgStyle} /></button></td> */}
                  <td><button className='addItem-btn' onClick={() => openSerialModal(item.id)}><img src={Addy} style={svgStyle} /></button></td>
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
          <h1>{getNom.itemName}: {totalSerialCount}</h1>
          <table>
            <thead>
              <tr className='th1'>
                <th>Serial Number</th>
                <th>State of item</th>
                <th>Depreciation Rate</th>
                <th>Date</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {getEm.map((getem) => (
                <tr key={getem.id}>
                  <td>{getem.serial_number}</td>
                  <td>{getem.state_of_item}</td>
                  <td>{getem.depreciation_rate}</td>
                  <td>{formatDate(getem.date)}</td>
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
