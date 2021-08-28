import React, { useState, useEffect } from 'react';
import numberWithCommas from '../utils/numberWithCommas';
import { ButtonToggle } from 'reactstrap';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import '../sass/css/infinityorder.css';
import { useHistory } from "react-router-dom";
import orderAPI from '../api/orderAPI';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function OrderItem(props) {

    const orderId = props.match.params.slug;

    const initialOrder = {
        OrderId: '1',
        OrderDate: '2021-08-12',
        ShippingMethodId: 'GHTK',
        PaymentMethodId: 'TTKNH',
        Status: 'Ordered',
        Email: 'xichtop99@gmail.com',
        Total: 300000,
        products: []
    }

    const [order, serOrder] = useState(initialOrder);

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
    
    useEffect(() => {
        const fetchItemOrder = async () => {
            try {
                let result = await orderAPI.getItem(orderId);
                serOrder(result);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
        }
        fetchItemOrder();
    }, [orderId])

    const history = useHistory();

    const handleCancel = () => {
        const fetchUpdateOrder = async () => {
            var result = {};
            try {
                result = await orderAPI.update(orderId);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `Hủy đơn hàng thành công!`,
                    type: "success",
                    ...configNotify
                });
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Hủy đơn hàng thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                history.push('/order');
            }
        }
        confirmAlert({
            title: 'Hủy Đơn Hàng',
            message: 'Bạn có chắc chắc muốn hủy đơn hàng này không?',
            buttons: [
              {
                label: 'Có',
                onClick: () => fetchUpdateOrder()
              },
              {
                label: 'Không',
                onClick: () => {
                    history.push(`/detail/${orderId}`);
                }
              }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    }

    const hanleConfirm = () => {
        const fetchConfirmOrder = async () => {
            var result = {};
            try {
                result = await orderAPI.confirm(orderId);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `Xác nhận đơn hàng thành công!`,
                    type: "success",
                    ...configNotify
                });
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Xác nhận đơn hàng thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                history.push('/order');
            }
        }
        confirmAlert({
            title: 'Xác Nhận Đơn Hàng',
            message: 'Bạn có chắc chắc muốn xác nhận đơn hàng này không?',
            buttons: [
              {
                label: 'Có',
                onClick: () => fetchConfirmOrder()
              },
              {
                label: 'Không',
                onClick: () => {
                    history.push(`/detail/${orderId}`);
                }
              }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
        
    }

    const handleBack = () => {
        history.push('/order');
    }

    return (
        <article class="card">
            <header class="card-header">Order ID: {order.OrderId}</header>
            <div class="card-body">
                <article class="card">
                    <div class="card-body row">
                        <div class="col"> <strong>Ngày đặt hàng:</strong> <br />{order.OrderDate.slice(0, 10)}</div>
                        <div class="col"> <strong>Đơn vị giao hàng:</strong> <br />{order.ShippingMethodId}</div>
                        <div class="col"> <strong>Khách hàng:</strong> <br />{order.Email}</div>
                        <div class="col"> <strong>Trạng thái:</strong> <br />{order.Status}</div>
                        <div class="col"> <strong>Tổng tiền:</strong> <br />{numberWithCommas(order.Total)}</div>
                    </div>
                </article>
                <hr />
                <ul class="row">
                    {order.products.map((product, productIndex) => (
                        <li key={productIndex} class="col-md-4">
                            <figure class="itemside mb-3">
                                <div class="aside">
                                <img style = {{
                                    width: '100px',
                                    height: '100px',
                                }}
                                    src={product.URLPicture} class="img-sm border" /></div>
                                <figcaption class="info align-self-center">
                                    <p class="title">{product.Title}</p>
                                    <span class="text-muted">Màu: <strong>{product.Color}</strong></span>
                                    <br />
                                    <span class="text-muted">Size: {product.Size}</span><br />
                                    <span class="text-muted">Số lượng: {product.Quantity}</span>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
                <hr />
                {order.Status === 'Ordered' ? <div>
                        <ButtonToggle color="info" onClick={handleBack}>Trở về</ButtonToggle>{' '}
                        <ButtonToggle color="success" onClick={hanleConfirm}>Xác Nhận</ButtonToggle>{' '}
                        <ButtonToggle color="danger" onClick={handleCancel}>Hủy</ButtonToggle>
                    </div> 
                    : 
                    <ButtonToggle color="info" onClick={handleBack}>Trở về</ButtonToggle>
                }
            </div>
        </article>
    )
}

export default OrderItem;