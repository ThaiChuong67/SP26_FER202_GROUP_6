import React, { useState } from 'react';

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    quantity: 0,
    image: '', // Lưu chuỗi base64 của ảnh
    description: ''
  });

  // Xử lý Upload ảnh 
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form>
      {/* Các input khác... */}
      <div>
        <label>Upload Ảnh Sản Phẩm:</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      {product.image && <img src={product.image} alt="Preview" width="100" />}
    </form>
  );
};

export default ProductForm;