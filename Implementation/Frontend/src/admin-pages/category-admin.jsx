import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios'

function CategoryAdmin() {
  const [categories, setCategories] = useState([]);

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
  <th>Depreciation Rate</th>
  return (
    <div className="category-container">
      {/* <h1 className='header1'>Categories</h1> */}
      {categories.map((category) =>(
      <div key={category.id} className="category">
        <h2>{category.category_name}</h2>
        <br />
        <br />
        <p>{category.description}</p>
      </div>
        ))}
    </div>
  );
}

export default CategoryAdmin;
