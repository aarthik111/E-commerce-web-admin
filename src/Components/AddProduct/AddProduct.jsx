import React, { useEffect, useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingProduct = location.state?.product || null;

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: '',
    category: 'women',
    new_price: '',
    old_price: ''
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (editingProduct) {
      setProductDetails({
        name: editingProduct.name,
        category: editingProduct.category,
        new_price: editingProduct.new_price,
        old_price: editingProduct.old_price
      });
      setPreview(editingProduct.image);
    }
  }, [editingProduct]);

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

  const submitHandler = async () => {
    if (!productDetails.name || !productDetails.new_price || !productDetails.old_price) {
      alert("❌ Please fill all fields.");
      return;
    }

    try {
      let imageUrl = editingProduct?.image || null;

      // If image is newly selected, upload it
      if (image) {
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

        imageUrl = uploadData.image_url;
      }

      const product = {
        ...productDetails,
        image: imageUrl
      };

      if (editingProduct) {
        // Update mode
        const updateRes = await fetch(`${BASE_URL}/updateproduct`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: editingProduct.id, updatedProduct: product })
        });

        const updateData = await updateRes.json();

        if (updateData.success) {
          alert("✅ Product updated successfully!");
          navigate('/listproduct');
        } else {
          alert("❌ Failed to update product.");
        }
      } else {
        // Add mode
        const addRes = await fetch(`${BASE_URL}/addproduct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });

        const addData = await addRes.json();

        if (addData.success) {
          alert("✅ Product added successfully");
          setProductDetails({ name: '', category: 'women', new_price: '', old_price: '' });
          setImage(null);
          setPreview(null);
        } else {
          alert("❌ Failed to add product.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Server error.");
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
          <img src={preview || upload_area} className='addproduct-thumnail-img' alt="product preview" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>

      <button onClick={submitHandler} className='addproduct-btn'>
        {editingProduct ? 'Update' : 'Add'}
      </button>
    </div>
  );
};

export default AddProduct;
