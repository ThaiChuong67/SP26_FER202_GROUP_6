import React from 'react';
import { Badge, Button, Image } from 'react-bootstrap';

const ProductItem = ({ product, handleDelete }) => {
  const isAvailable = product.quantity > 0; // Rule: quantity >= 0

  return (
    <tr className="align-middle text-center">
      <td>{product.id}</td>
      <td>
        {product.image ? (
          <Image 
            src={product.image} 
            rounded 
            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
          />
        ) : (
          <small className="text-muted">No Image</small>
        )}
      </td>
      <td className="fw-bold">{product.name}</td>
      <td>{Number(product.price).toLocaleString()}đ</td>
      <td>
        {/* Task: Hiển thị trạng thái tồn kho  */}
        {isAvailable ? (
          <Badge bg="success">Còn hàng ({product.quantity})</Badge>
        ) : (
          <Badge bg="danger">Hết hàng</Badge>
        )}
      </td>
      <td>
        <Button variant="outline-primary" size="sm" className="me-2">Sửa</Button>
        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(product.id)}>Xóa</Button>
      </td>
    </tr>
  );
};

export default ProductItem;