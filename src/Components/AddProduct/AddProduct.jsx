import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    category: 'women',
    new_price: '',
    old_price: ''
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    if (!productDetails.name || !image || !productDetails.new_price || !productDetails.old_price) {
      alert("❌ Please fill all fields and select an image");
      return;
    }

    try {
      // Upload image to backend -> cloudinary
      const formData = new FormData();
      formData.append('product', image);

      const uploadRes = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        alert("❌ Image upload failed");
        return;
      }

      const product = {
        ...productDetails,
        image: uploadData.image_url
      };

      const addRes = await fetch(`${BASE_URL}/addproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(product)
      });

      const addData = await addRes.json();

      if (addData.success) {
        alert("✅ Product added successfully");
        setProductDetails({
          name: '',
          category: 'women',
          new_price: '',
          old_price: ''
        });
        setImage(null);
        setPreview(null);
      } else {
        alert("❌ Failed to add product to database");
      }
    } catch (error) {
      console.error("Error while adding product:", error);
      alert("❌ Server error. Try again.");
    }
  };

  return (
    <div className='addproduct'>
      <div className="addproduct-itemfeild">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfeild">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="number" name='old_price' placeholder='Type here' />
        </div>
        <div className="addproduct-itemfeild">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="number" name='new_price' placeholder='Type here' />
        </div>
      </div>

      <div className="addproduct-itemfeild">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kids</option>
        </select>
      </div>

      <div className="addproduct-itemfeild">
        <label htmlFor="file-input">
          <img
            src={preview || upload_area}
            className='addproduct-thumnail-img'
            alt="product preview"
          />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>

      <button onClick={Add_Product} className='addproduct-btn'>ADD</button>
    </div>
  );
};

export default AddProduct;
