import React from 'react';
import { Badge, Button, Image } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ProductItem = ({ product, index, handleDelete, handleShowEdit }) => {
    const isAvailable = product.quantity > 0;
    return (
        <tr>
            <td className="fw-bold text-white-50">{index}</td>
            <td>
                {product.image ? (
                    <Image src={product.image} rounded className="border border-secondary shadow-sm" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                ) : (
                    <div className="border border-secondary rounded d-flex align-items-center justify-content-center text-muted" style={{ width: '50px', height: '50px', margin: '0 auto', fontSize: '0.7rem' }}>Trống</div>
                )}
            </td>
            <td className="fw-bold text-white text-start">{product.name}</td>
            <td><Badge bg="transparent" className="px-3 py-2 border border-warning text-warning rounded-pill">{Number(product.price).toLocaleString('vi-VN')} ₫</Badge></td>
            <td>
                {isAvailable ? (
                    <Badge bg="transparent" className="px-3 py-2 border border-success text-success rounded-pill">Còn ({product.quantity})</Badge>
                ) : (
                    <Badge bg="transparent" className="px-3 py-2 border border-danger text-danger rounded-pill">Hết</Badge>
                )}
            </td>
            <td>
                <div className="d-flex justify-content-center gap-2">
                    <Button variant="outline-warning" size="sm" className="rounded-circle btn-icon-pro" onClick={() => handleShowEdit(product)}>
                        <FaEdit size={12} />
                    </Button>
                    <Button variant="outline-danger" size="sm" className="rounded-circle btn-icon-pro" onClick={() => handleDelete(product.id)}>
                        <FaTrashAlt size={12} />
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default ProductItem;