import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import NavbarAdmin from './navbarAdmin';
import axios from 'axios'
import Add from '../images/add.svg'
import Delete from '../images/delete.svg'
import Model from 'react-modal'

function CategoryAdmin() {
  const svgStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '14px',
    marginTop: '2px',
    backgroundColor: 'rgb(206, 206, 236)'
  }
  const modal = {
    overlay: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: '33%',
      marginLeft: '495px',
      height: '47vh',
      backgroundColor: 'rgb(163, 187, 197)',
      border: 'none',
      borderRadius: '12px',
      gap: '23px',
      marginTop: '53px',
      color: "black",
      padding: '12px 0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }

  const [categories, setCategories] = useState([]);

  const [addVisible, setAddVisible] = useState(false);

  const [category, setCategory] = useState({
    category_name: '',
    description: ''
  })

  const handleMake = async (event) => {
    try {
      await axios.post(`http://localhost:5500/category`, category);
      console.log("Category added successfully")
      setAddVisible(false);
    } catch {
      console.log('Error')
    }
  }

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
  }, [categories]);

  const handleChange2 = (event) => {
    setCategory((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };
  const kain = {
    marginLeft: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'rgb(163, 187, 197)',
    paddingTop: '70px',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    color: 'black'
  };

  const handleSerialDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5500/delete-category/${id}`);
      window.alert("Deleted successfully");
      console.log("Response from deletion ", response.data);
    } catch (error) {
      console.error('Error fetching items: ', error);
    }
  }


  return (
    <div>
      <NavbarAdmin></NavbarAdmin>
      <div style={kain}>
        <h1>Add A New Category</h1>
      </div>
      <div className="category-container">
        <button onClick={() => setAddVisible(true)} className='add-btn'><img src={Add} style={svgStyle} /><p>Add Category</p></button>
        <Model isOpen={addVisible} onRequestClose={() => setAddVisible(false)} style={modal}>
          <h1>Add Category</h1>
          <input type='text' placeholder='Category Name' name='category_name' onChange={handleChange2} />
          <input type='text' placeholder='Description' name='description' onChange={handleChange2} />
          <button onClick={handleMake}>Submit</button>
        </Model>
        {categories.map((category) => (
          <div key={category.id} className="category">
            <h2>{category.category_name}</h2>
            <br />
            <div style={{display: 'flex', flexDirection: 'inline', gap: '9px'}}>
              <p>{category.description}</p>
              <button className='addItem-btn' onClick={() => handleSerialDelete(category.id)}><img src={Delete} style={svgStyle} /></button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryAdmin;
