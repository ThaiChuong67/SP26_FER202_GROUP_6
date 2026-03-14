import React from 'react';
import { Badge, Button, Image } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ProductItem = ({ product, handleDelete, handleShowEdit }) => {
  const isAvailable = product.quantity > 0;
  return (
    <tr className="align-middle text-center">
      <td className="fw-bold text-muted">{product.id}</td>
      <td>
        {product.image ? (
          <Image src={product.image} rounded className="border border-secondary" style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
        ) : (
          <Badge bg="secondary">No Image</Badge>
        )}
      </td>
      <td className="fw-bolder text-dark">{product.name}</td>
      <td><Badge bg="dark" className="px-3 py-2 border border-warning text-warning rounded-pill">{Number(product.price).toLocaleString()} ₫</Badge></td>
      <td>
        {isAvailable ? <Badge bg="success" className="px-2 py-1 rounded-pill">Còn ({product.quantity})</Badge> : <Badge bg="danger" className="px-2 py-1 rounded-pill">Hết hàng</Badge>}
      </td>
      <td>
        <div className="d-flex justify-content-center gap-2">
           <Button variant="warning" size="sm" className="rounded-circle border border-dark" style={{width:'32px', height:'32px'}} onClick={() => handleShowEdit(product)}><FaEdit size={12} className="mb-1"/></Button>
           <Button variant="dark" size="sm" className="rounded-circle border border-warning" style={{width:'32px', height:'32px'}} onClick={() => handleDelete(product.id)}><FaTrashAlt className="text-warning mb-1" size={12}/></Button>
        </div>
      </td>
    </tr>
  );
};

export default ProductItem;