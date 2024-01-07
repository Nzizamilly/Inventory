import { Link } from 'react-router-dom';
import '../style.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'
import axios from 'axios'
import AddItem from '../images/addItem.svg'
import Update from '../images/update.svg'
import Delete from '../images/delete.svg'

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
  state_of_item: '',
  depreciation_rate: '',
  supplier: '',
  // category: ''
 });

 const handleAddSimpleItemClick = async () => {
  try {
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

  const handleCategoryClick = (categoryId) => {
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

  return (
    <div className='items-container'>
      <div class='item'>
        {categories.map(category => (
          <button key={category.id} onClick={() => handleCategoryClick(category.id)} className='buttonStyle2'>{category.category_name}</button>
        ))}

        <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
          <h1>Items for category: {selectedCategory}</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>State of item</th>
                <th>Depreciation Rate</th>
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
                  <td> {item.name}</td>
                  <td> {item.state_of_item}</td>
                  <td> {item.depreciation_rate}</td>
                  <td> {item.first_name}</td>
                  <td> {item.category_name}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td><button className='addItem-btn'><img src={Update} style={svgStyle} /></button></td>
                  <td><button className='addItem-btn'><img src={Delete} style={svgStyle} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
        <Modal isOpen={isSimpleModalOpen} onRequestClose={closeSimpleModal} style={modalStyles}>
        <h1>Create A New Item</h1>
        <input placeholder='Name' name='name' type='text' value={newItem.name} onChange={(e)=> setNewItem({ ...newItem, name: e.target.value})}/>
        <br />
        <input placeholder='State of item' name='state_of_item' type='text' value={newItem.state_of_item} onChange={(e)=> setNewItem({ ...newItem, state_of_item: e.target.value})}/>
        <br />
        <input placeholder='Depreciation rate' name='depreciation_rate' type='text' value={newItem.depreciation_rate} onChange={(e)=> setNewItem({ ...newItem, depreciation_rate: e.target.value})}/>
        <br />
        <input placeholder='Supplier' name='supplier' type='text' value={newItem.supplier} onChange={(e)=> setNewItem({ ...newItem, supplier: e.target.value})}/>
        <br />
        {/* <input placeholder='Category' name='category' type='text' value={newItem.category} onChange={(e)=> setNewItem({ ...newItem, category: e.target.value})}/>
        <br /> */}
        <button onClick={handleAddSimpleItemClick}>Send</button>
        </Modal>
      </div>
    </div>
  );
}

export default ItemsAdmin;
