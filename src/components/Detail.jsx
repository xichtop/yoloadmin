import React, { useState, useEffect } from 'react';
import numberWithCommas from '../utils/numberWithCommas';
import { ButtonToggle } from 'reactstrap';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import '../sass/css/infinityorder.css';
import { useHistory } from "react-router-dom";
import orderAPI from '../api/orderAPI';
import { useSelector } from 'react-redux';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function OrderItem(props) {

    const orderId = props.match.params.slug;
    
    const token = useSelector(state => state.employee.token);

    const employeeId = useSelector(state => state.employee.user.EmployeeId);

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
                let result = await orderAPI.getItem(orderId, token);
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
                result = await orderAPI.update(orderId, employeeId, token);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `H???y ????n h??ng th??nh c??ng!`,
                    type: "success",
                    ...configNotify
                });
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `H???y ????n h??ng th???t b???i, vui l??ng th??? l???i sau!`,
                    type: "warning",
                    ...configNotify
                });
                history.push('/order');
            }
        }
        confirmAlert({
            title: 'H???y ????n H??ng',
            message: 'B???n c?? ch???c ch???c mu???n h???y ????n h??ng n??y kh??ng?',
            buttons: [
              {
                label: 'C??',
                onClick: () => fetchUpdateOrder()
              },
              {
                label: 'Kh??ng',
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
                result = await orderAPI.confirm(orderId, employeeId, token);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `X??c nh???n ????n h??ng th??nh c??ng!`,
                    type: "success",
                    ...configNotify
                });
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `X??c nh???n ????n h??ng th???t b???i, vui l??ng th??? l???i sau!`,
                    type: "warning",
                    ...configNotify
                });
                history.push('/order');
            }
        }
        confirmAlert({
            title: 'X??c Nh???n ????n H??ng',
            message: 'B???n c?? ch???c ch???c mu???n x??c nh???n ????n h??ng n??y kh??ng?',
            buttons: [
              {
                label: 'C??',
                onClick: () => fetchConfirmOrder()
              },
              {
                label: 'Kh??ng',
                onClick: () => {
                    history.push(`/detail/${orderId}`);
                }
              }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
        
    }

    const hanleDeliver = (OrderId) => {
        const fetchUpdateOrder = async () => {
            var result = {};
            try {
                result = await orderAPI.deliver(OrderId, employeeId, token);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `Giao h??ng th??nh c??ng!`,
                    type: "success",
                    ...configNotify
                });
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Giao h??ng th???t b???i, vui l??ng th??? l???i sau!`,
                    type: "warning",
                    ...configNotify
                });
                history.push('/order');
            }
        }
        confirmAlert({
            title: 'Giao H??ng',
            message: 'B???n c?? ch???c ch???c mu???n giao h??ng n??y kh??ng?',
            buttons: [
                {
                    label: 'C??',
                    onClick: () => fetchUpdateOrder()
                },
                {
                    label: 'Kh??ng',
                    onClick: () => {
                        history.push('/order');
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
                        <div class="col"> <strong>Ng??y ?????t h??ng:</strong> <br />{order.OrderDate.slice(0, 10)}</div>
                        <div class="col"> <strong>????n v??? giao h??ng:</strong> <br />{order.ShippingMethodId}</div>
                        <div class="col"> <strong>Kh??ch h??ng:</strong> <br />{order.Email}</div>
                        <div class="col"> <strong>Tr???ng th??i:</strong> <br />{order.Status}</div>
                        <div class="col"> <strong>T???ng ti???n:</strong> <br />{numberWithCommas(order.Total)}</div>
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
                                    <span class="text-muted">M??u: <strong>{product.Color}</strong></span>
                                    <br />
                                    <span class="text-muted">Size: {product.Size}</span><br />
                                    <span class="text-muted">S??? l?????ng: {product.Quantity}</span>
                                </figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
                <hr />
                {order.Status === 'Ordered' ? <div>
                        <ButtonToggle color="info" onClick={handleBack}>Tr??? v???</ButtonToggle>{' '}
                        <ButtonToggle color="success" onClick={hanleConfirm}>X??c Nh???n</ButtonToggle>{' '}
                        <ButtonToggle color="danger" onClick={handleCancel}>H???y</ButtonToggle>
                    </div> 
                    : 
                    <div>
                    {order.Status === 'Confirmed' ? <div>
                        <ButtonToggle color="info" onClick={handleBack}>Tr??? v???</ButtonToggle>{' '}
                        <ButtonToggle color="success" onClick={hanleDeliver}>Giao h??ng</ButtonToggle>{' '}
                    </div> 
                    : 
                    <ButtonToggle color="info" onClick={handleBack}>Tr??? v???</ButtonToggle>}
                    </div>
                }
            </div>
        </article>
    )
}

export default OrderItem;