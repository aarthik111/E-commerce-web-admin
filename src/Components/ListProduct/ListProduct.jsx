import React, { useEffect, useState, useCallback } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png'; // Make sure this file exists
import { useNavigate } from 'react-router-dom';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchInfo = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/allproducts`);
      const data = await res.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  const remove_product = async (id) => {
    try {
      await fetch(`${BASE_URL}/removeproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      await fetchInfo();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const edit_product = (product) => {
    navigate('/addproduct', { state: { product } });
  };

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
        <p>Edit</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img src={product.image} className='listproduct-product-icon' alt="product" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={() => remove_product(product.id)} className="listproduct-remove-icon" src={cross_icon} alt="Remove" />
              <span onClick={() => edit_product(product)} className="listproduct-edit-icon" style={{ cursor: 'pointer', fontSize: '20px' }}>
                ✏️
              </span>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
