import React, { useEffect, useState, useCallback } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

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
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
