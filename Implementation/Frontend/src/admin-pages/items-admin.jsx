import { Link } from 'react-router-dom';
import '../style.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'
import axios from 'axios'

function ItemsAdmin() {

  const modalStyles = {
    content: {
      top: '50%',
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
      lineHeight: '1.5',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center'
    },
  }

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className='items-container'>
      <div className='item'>
        {categories.map(category => (
          <button key={category.id} onClick={() => handleCategoryClick(category.id)} className='buttonStyle2'>{category.name}</button>
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
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td> {item.id}</td>
                  <td> {item.name}</td>
                  <td> {item.state_of_item}</td>
                  <td> {item.depreciation_rate}</td>
                  <td> {item.supplier}</td>
                  <td> {item.category}</td>
                  <td> {item.createdAt}</td>
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
