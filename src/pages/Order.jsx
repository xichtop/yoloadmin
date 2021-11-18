import React, { useEffect, useState } from 'react';
import orderAPI from '../api/orderAPI';
import { ButtonToggle } from 'reactstrap';
import numberWithCommas from '../utils/numberWithCommas';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';

// notification
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

// confirm alert
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 

// React bootstrap table
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, numberFilter, dateFilter, selectFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

const EditButton = (props) => {

    const token = useSelector(state => state.employee.token);

    const employeeId = useSelector(state => state.employee.user.EmployeeId);

    const history = useHistory();

    const OrderId = props.row.OrderId;

    const Status = props.row.Status;

    const handleCheck = props.handleCheck;

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

    const hanleConfirm = () => {
        const fetchConfirmOrder = async () => {
            var result = {};
            try {
                result = await orderAPI.confirm(OrderId, employeeId, token);
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
                handleCheck();
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Xác nhận đơn hàng thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                handleCheck();
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

    const hanleCancel = () => {
        const fetchUpdateOrder = async () => {
            var result = {};
            try {
                result = await orderAPI.update(OrderId, employeeId, token);
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
                handleCheck();
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Hủy đơn hàng thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                handleCheck();
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

    const hanleDeliver = () => {
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
                    message: `Giao hàng thành công!`,
                    type: "success",
                    ...configNotify
                });
                handleCheck();
                history.push('/order');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Giao hàng thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                handleCheck();
                history.push('/order');
            }
        }
        confirmAlert({
            title: 'Giao Hàng',
            message: 'Bạn có chắc chắc muốn giao hàng này không?',
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

    const hanleShowDetail = () => {
        history.push(`/detail/${OrderId}`);
    }
    
    return (
        <div>
            {Status === 'Ordered' ?
                                    <td>
                                        <ButtonToggle color="info" onClick={hanleShowDetail}>Xem Chi Tiết</ButtonToggle>{' '}
                                        <ButtonToggle color="success" onClick={hanleConfirm}>Xác Nhận</ButtonToggle>{' '}
                                        <ButtonToggle color="danger" onClick={hanleCancel}>Hủy</ButtonToggle>
                                    </td>
                                    :
                                    <td>
                                        {Status === 'Confirmed' ? <div>
                                        <ButtonToggle color="info" onClick={hanleShowDetail}>Xem Chi Tiết</ButtonToggle>{' '}
                                        <ButtonToggle color="primary" onClick={hanleDeliver}>Giao hàng</ButtonToggle>{' '}
                                        </div>
                                        :
                                        <ButtonToggle color="info" onClick={hanleShowDetail}>Xem Chi Tiết</ButtonToggle>
                                        }
                                    </td>
                                }
        </div>
    );
};

const OrderTable = () => {

    const token = useSelector(state => state.employee.token);

    const [orders, setOrders] = useState([]);

    const [check, setCheck] = useState(false);

    const [orderChange, setOrderChange] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            var orders = [];
            try {
                orders = await orderAPI.getAll(token);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setOrders(orders);
            setOrderChange(!orderChange);
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            var orders = [];
            try {
                orders = await orderAPI.getAll(token);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setOrders(orders);
        }
        fetchOrders();
    }, [check]);

    const handleCheck = () => {
        setCheck(!check);
    }

    const PageOptions = {
        sizePerPageList: [{
            text: '10', value: 10
          }, {
            text: '20', value: 20
          }, {
            text: '30', value: 30
          }, {
            text: 'All', value: orders.length
          }]
    };

    const cellButton = (cell, row, rowIndex) => (
        <EditButton cell={cell} row={row} rowIndex={rowIndex} handleCheck = {handleCheck}/>
    );

    const statusOptions = {
        Ordered: 'Chờ xác nhận',
        Confirmed: 'Đang giao hàng',
        Delivered: 'Đã giao hàng',
        Canceled: 'Đã hủy',
    };

    const shippings = {
        Ahamove: 'Ahamove',
        GHTK: 'Giao hàng tiết kiệm',
        Grab: 'Giao hàng nhanh (Grab)',
        VTPost: 'Viettel Post'
    };

    const payments = {
        TTKNN: 'Thanh toán khi nhận hàng',
        PayPal: 'Thanh toán online qua PayPal',
    };

    const columns = [{
        dataField: 'OrderId',
        text: 'Mã hóa đơn',
        sort: true,
        filter: textFilter({ placeholder: 'Mã hóa đơn ...', }),
        style: {
            fontWeight: 'bold',
        },
        headerStyle: {
            width: '120px',
        }
    }, {
        dataField: 'OrderDate',
        text: 'Ngày đặt hàng',
        sort: true,
        formatter: cell => cell.split('T')[0],
        filter: dateFilter()
    }, {
        dataField: 'ShippingMethodId',
        text: 'Đơn vị giao hàng',
        sort: true,
        // formatter: cell => shippings[cell],
        formatter: cell => shippings[cell],
        filter: selectFilter({
            options: shippings,
            placeholder: "Chọn đơn vị ..."
        })
    }, {
        dataField: 'PaymentMethodId',
        text: 'Hình thức thanh toán',
        sort: true,
        formatter: cell => payments[cell],
        filter: selectFilter({
            options: payments,
            placeholder: "Chọn hình thức ..."
        })
    }, {
        dataField: 'Email',
        text: 'Email khách hàng',
        sort: true,
        filter: textFilter({ placeholder: 'Nhập email ...', })
    },{
        dataField: 'Total',
        text: 'Tổng tiền',
        sort: true,
        formatter: cell => numberWithCommas(cell),
        filter: numberFilter({ placeholder: 'Nhập tổng tiền ...', })
    },{
        dataField: 'Status',
        text: 'Trạng thái',
        sort: true,
        formatter: cell => statusOptions[cell],
        filter: selectFilter({
            options: statusOptions
        })
    },{
        dataField: 'Status',
        text: 'Trạng thái',
        sort: true,
        formatter: cell => statusOptions[cell],
        filter: selectFilter({
            options: statusOptions
        })
    },
    {
        dataField: "OrderId",
        text: "Thao Tác",
        formatter: cellButton,
        sort: true,
        headerStyle: {
            width: '250px',
        },
    }];

    const MyExportCSV = (props) => {
        const handleClick = () => {
          props.onExport();
        };
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        }}>
            <button className="btn btn-info" onClick={ handleClick }>Xuất File</button>
          </div>
        );
    };

    return (
        <div >
            <div className="row">

                <div className="col-sm-12 btn btn-info">
                    Danh Sách Hóa Đơn
                </div>
            </div>
            <ToolkitProvider
                keyField="DuscountId"
                data={orders}
                columns={columns}
                exportCSV={{
                    fileName: 'hoadon.csv',
                    blobType: 'text/csv;charset=UTF-8'
                }}
            >
                {
                    props => (
                        <div>
                            <BootstrapTable
                                keyField='DiscountId'
                                data={orders}
                                columns={columns}
                                tabIndexCell
                                striped
                                hover
                                condensed
                                pagination={paginationFactory(PageOptions)}
                                filter={filterFactory()}
                                filterPosition="top"
                                {...props.baseProps} />
                            <hr />
                            <MyExportCSV {...props.csvProps}>Xuất File Excel!!</MyExportCSV>
                            <hr />
                        </div>
                    )
                }
            </ToolkitProvider>
        </div>
    )
}

export default OrderTable;