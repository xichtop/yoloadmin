import React from 'react';
import { Label, Button, FormGroup } from 'reactstrap'
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { refresh } from '../slice/productSlice';
import productAPI from '../api/productAPI'

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export default function ConfirmProduct() {

    const history = useHistory();

    const dispatch = useDispatch();

    const product = useSelector(state => state.product);

    const token = useSelector(state => state.employee.token);

    const configNotify = {
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 2000,
            onScreen: true
        }
    }

    const handleConfirm = () => {
        confirmAlert({
            title: 'Thêm Sản Phẩm',
            message: 'Bạn có chắc chắc muốn thêm sản phẩm này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => fetchAddProduct()
                },
                {
                    label: 'Không',
                    onClick: () => {
                        const action = refresh();
                        dispatch(action);
                        history.push(`/product`);
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });

        const fetchAddProduct = async () => {
            var result = null;
            try {
                result = await productAPI.addItem(product, token);

            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }

            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `Thêm sản phẩm thành công!`,
                    type: "success",
                    ...configNotify
                });
                const action = refresh();
                dispatch(action);
                history.push(`/product`);
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Thêm sản phẩm thất bại, vui lòng thử lại sau!`,
                    type: "danger",
                    ...configNotify
                });
                // const action = refresh();
                // dispatch(action);
                history.push(`/product`);
            }
        }
    }

    const handleCancel = () => {
        const action = refresh();
        dispatch(action);
        history.push('/product');
    }

    return (
        <div className="login" >
            <div className="box" >
                <div className="login-box" style={{
                    width: "600px"
                }}>
                    <h2>Xác Nhận Sản Phẩm</h2>
                    <FormGroup>
                        <div >
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <Label >Mã sản phẩm: <strong>{product.ProductId}</strong></Label>
                                <Label >Danh mục: <strong>{product.CategoryId}</strong></Label>
                                <Label >Bộ sưu tập: <strong>{product.CollectionId}</strong></Label>
                                <Label >Kiểu dáng: <strong>{product.FormId}</strong></Label>
                                <Label >Tên sản phẩm: <strong>{product.Title}</strong></Label>
                                <Label >Chất liệu: <strong>{product.Material}</strong></Label>
                                <Label >Phong cách: <strong>{product.Style}</strong></Label>
                                <Label >Giá: <strong>{product.UnitPrice}</strong></Label>
                                <Label >Số lượng: <strong>{product.Quantity}</strong></Label>
                                <Label >Danh sách màu:</Label>
                                <div className="color-picker">
                                    {product.colors.map((color, index) => (
                                        <div className="color-picker-item" key={index}>
                                            <div className="color-picker-span" style={{
                                                backgroundColor: color.Color,
                                                width: "30px",
                                                height: "30px"
                                            }}>
                                            </div> </div>
                                    ))}
                                </div>
                                <Label >Danh sách size: <strong>{product.sizes}</strong></Label>
                                <Label >Danh sách hình ảnh: </Label>
                            </div>
                            <div className="color-picker">
                                <img
                                    className="ref"
                                    src={product.URLPicture || "https://via.placeholder.com/60x60"}
                                    alt="Uploaded Images"
                                    height="60"
                                    width="60"
                                    objectFit="cover"
                                />
                                {product.colors.map((color, index) => (
                                    <img key={index}
                                        className="ref"
                                        src={color.URLPicture}
                                        alt="Uploaded Images"
                                        height="60"
                                        width="60"
                                        objectFit="cover"
                                    />
                                ))}
                            </div>
                        </div>
                    </FormGroup>
                    <Button color='success' onClick={handleConfirm}>
                        Tiến hành xác nhận
                    </Button>{' '}
                    <Button color='danger' onClick={handleCancel}>
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    )
}