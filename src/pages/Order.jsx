import React, { useEffect, useState } from 'react';
import orderAPI from '../api/orderAPI';
import { Table, Pagination, PaginationItem, PaginationLink, ButtonToggle } from 'reactstrap';
import numberWithCommas from '../utils/numberWithCommas';
import { useHistory } from "react-router-dom";

// notification
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const OrderTable = () => {

    const history = useHistory();

    const [check, setCheck] = useState(false);

    const [orders, setOrders] = useState([]);

    const [ordersTemp, setOrdersTemp] = useState([]);

    const [paginationMax, setPaginationMax] = useState(1);

    const [paginationIndex, setPaginationIndex] = useState(1);
    
    const [paginationBetween, setPaginationBetween] = useState(2);

    const configNotify = {
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 3000,
            onScreen: true
        }
    }

    useEffect(() => {
        const fetchOrders = async () => {
            var orders = [];
            try {
                orders = await orderAPI.getAll();
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            console.log(orders);
            setOrders(orders);
            setOrdersTemp(orders.slice(0, 10));
            const pagiMax = Math.floor(orders.length / 10) + 1;
            setPaginationMax(pagiMax);
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            var orders = [];
            try {
                orders = await orderAPI.getAll();
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            console.log(orders);
            setOrders(orders);
            const newOrders = orders.slice(10 * (paginationIndex - 1), 10 * paginationIndex);
            setOrdersTemp(newOrders);
            setCheck(false);
        }
        fetchOrders();
    }, [check]);

    useEffect(() => {
        const newOrders = orders.slice(10 * (paginationIndex - 1), 10 * paginationIndex);
        setOrdersTemp(newOrders);
        if (paginationIndex > 1 && paginationIndex < paginationMax) {
            setPaginationBetween(paginationIndex);
        }
    }, [paginationIndex])

    const handleCurrent = (index) => {
        setPaginationIndex(index);
    }

    const handleMinus = () => {
        setPaginationIndex(paginationIndex - 1);
    }

    const handlePlus = () => {
        setPaginationIndex(paginationIndex + 1);
    }

    const hanleConfirm = (OrderId) => {
        const fetchConfirmOrder = async () => {
            var result = {};
            try {
                result = await orderAPI.confirm(OrderId);
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
                setCheck(true);
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Xác nhận đơn hàng thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                setCheck(true);
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
                    history.push('/order');
                }
              }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    }

    const hanleCancel = (OrderId) => {
        const fetchUpdateOrder = async () => {
            var result = {};
            try {
                result = await orderAPI.update(OrderId);
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
                setCheck(true);
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Hủy đơn hàng thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                setCheck(true);
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
                    history.push('/order');
                }
              }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    }

    const hanleShowDetail = (OrderId) => {
        history.push(`/detail/${OrderId}`);
    }

    return (
        <div >
            <div className="row">
                <div className="col-sm-12 btn btn-info">
                    Danh Sách Hóa Đơn
                </div>
            </div>
            <div style={{
                height: "500px"
            }} >
                <Table striped hover bordered responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Mã Hóa Đơn</th>
                            <th>Ngày Đặt Hàng</th>
                            <th>Đơn Vị Giao Hàng</th>
                            <th>Loại Thanh Toán</th>
                            <th>Email</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersTemp.map((order, index) => (
                            <tr key={index} >
                                <th scope="row">{index + 1}</th>
                                <td>{order.OrderId}</td>
                                <td>{order.OrderDate.slice(0,10)}</td>
                                <td>{order.ShippingMethodId}</td>
                                <td>{order.PaymentMethodId}</td>
                                <td>{order.Email}</td>
                                <td>{numberWithCommas(order.Total)}</td>
                                <td>{order.Status}</td>
                                {order.Status === 'Ordered' ?
                                    <td>
                                        <ButtonToggle color="info" onClick={() => hanleShowDetail(order.OrderId)}>Xem Chi Tiết</ButtonToggle>{' '}
                                        <ButtonToggle color="success" onClick={() => hanleConfirm(order.OrderId)}>Xác Nhận</ButtonToggle>{' '}
                                        <ButtonToggle color="danger" onClick={() => hanleCancel(order.OrderId)}>Hủy</ButtonToggle>
                                    </td>
                                    :
                                    <td>
                                        <ButtonToggle color="info" onClick={() => hanleShowDetail(order.OrderId)}>Xem Chi Tiết</ButtonToggle>
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
                <Pagination aria-label="Page navigation example">
                    {paginationIndex === 1 ?
                        <PaginationItem disabled>
                            <PaginationLink previous />
                        </PaginationItem>
                        :
                        <PaginationItem>
                            <PaginationLink previous onClick={handleMinus} />
                        </PaginationItem>}
                    {paginationBetween - 1 === paginationIndex ?
                        <PaginationItem active>
                            <PaginationLink onClick={() => handleCurrent(paginationBetween - 1)}>
                                {paginationBetween - 1}
                            </PaginationLink>
                        </PaginationItem>
                        :
                        <PaginationItem>
                            <PaginationLink onClick={() => handleCurrent(paginationBetween - 1)}>
                                {paginationBetween - 1}
                            </PaginationLink>
                        </PaginationItem>
                    }
                    {paginationBetween === paginationIndex ?
                        <PaginationItem active>
                            <PaginationLink onClick={() => handleCurrent(paginationBetween)}>
                                {paginationBetween}
                            </PaginationLink>
                        </PaginationItem>
                        :
                        <PaginationItem>
                            <PaginationLink onClick={() => handleCurrent(paginationBetween)}>
                                {paginationBetween}
                            </PaginationLink>
                        </PaginationItem>
                    }
                    {paginationBetween + 1 === paginationIndex ?
                        <PaginationItem active>
                            <PaginationLink onClick={() => handleCurrent(paginationBetween + 1)}>
                                {paginationBetween + 1}
                            </PaginationLink>
                        </PaginationItem>
                        :
                        <PaginationItem>
                            <PaginationLink onClick={() => handleCurrent(paginationBetween + 1)}>
                                {paginationBetween + 1}
                            </PaginationLink>
                        </PaginationItem>
                    }
                    {paginationMax === paginationIndex ?
                        <PaginationItem disabled>
                            <PaginationLink next />
                        </PaginationItem>
                        :
                        <PaginationItem>
                            <PaginationLink next onClick={handlePlus} />
                        </PaginationItem>
                    }
                </Pagination>
            </div>
        </div>
    )
}

export default OrderTable;