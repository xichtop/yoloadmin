import React, { useEffect, useState } from 'react';
import userAPI from '../api/userAPI';
import { ButtonToggle } from 'reactstrap';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';

//React bootstrap table
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const EditButton = (props) => {

    const history = useHistory();

    const email = props.row.Email;

    const status = props.row.Status;

    const handleCheck = props.handleCheck;

    const token = useSelector(state => state.employee.token);

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

    const hanleActive = () => {
        const newUser = {
            email: email.trim(),
            newStatus: 'On',
        }
        const fetchUpdateUser = async () => {
            var result = {};
            try {
                result = await userAPI.updateStatus(newUser, token);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `Kích hoạt tài khoản thành công!`,
                    type: "success",
                    ...configNotify
                });
                handleCheck();
                history.push('/user');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Kích hoạt tài khoản thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                handleCheck();
                history.push('/user');
            }
        }
        confirmAlert({
            title: 'Kích Hoạt Tài Khoản',
            message: 'Bạn có chắc chắc muốn kích hoạt tài khoản này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => fetchUpdateUser()
                },
                {
                    label: 'Không',
                    onClick: () => {
                        history.push('/user');
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    }

    const hanleLock = () => {
        const newUser = {
            email: email.trim(),
            newStatus: 'Off',
        }
        const fetchUpdateUser = async () => {
            var result = {};
            try {
                result = await userAPI.updateStatus(newUser, token);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `Khóa tài khoản thành công!`,
                    type: "success",
                    ...configNotify
                });
                handleCheck();
                history.push('/user');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Khóa tài khoản thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                handleCheck();
                history.push('/user');
            }
        }
        confirmAlert({
            title: 'Khóa Tài Khoản',
            message: 'Bạn có chắc chắc muốn khóa tài khoản này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => fetchUpdateUser()
                },
                {
                    label: 'Không',
                    onClick: () => {
                        history.push('/user');
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    }
    return (
        <div>
            {status.trim() === 'Off' ?
                <td>
                    <ButtonToggle color="info" onClick={hanleActive}>Kích Hoạt</ButtonToggle>
                </td>
                :
                <td>
                    <ButtonToggle color="danger" onClick={hanleLock}>Khóa</ButtonToggle>
                </td>
            }
        </div>
    );
};

const UserTable = () => {

    const token = useSelector(state => state.employee.token);

    const [users, setUsers] = useState([]);

    const [check, setCheck] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            var users = [];
            try {
                users = await userAPI.getAll(token);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setUsers(users);
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            var users = [];
            try {
                users = await userAPI.getAll(token);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setUsers(users);
        }
        fetchOrders();
    }, [check]);

    const handleCheck = () => {
        setCheck(!check);
    }

    const cellButton = (cell, row, rowIndex) => (
        <EditButton cell={cell} row={row} rowIndex={rowIndex} handleCheck = {handleCheck}/>
    )

    const selectOptions = {
        On: 'On',
        Off: 'Off',
    };

    const columns = [{
        dataField: 'Email',
        text: 'Email',
        sort: true,
        filter: textFilter({ placeholder: 'Nhập email ...', }),
    }, {
        dataField: 'FullName',
        text: 'Họ Tên',
        sort: true,
        filter: textFilter({ placeholder: 'Nhập họ tên ...', }),
    }, {
        dataField: 'Phone',
        text: 'Số điện thoại',
        sort: true,
        filter: textFilter({ placeholder: 'Nhập số điện thoại ...', }),
    },
    {
        dataField: 'Address',
        text: 'Địa chỉ',
        sort: true,
        filter: textFilter({ placeholder: 'Nhập địa chỉ ...', }),
    },
    {
        dataField: 'Status',
        text: 'Trạng Thái',
        sort: true,
        formatter: cell => selectOptions[cell],
        filter: selectFilter({
            options: selectOptions
        })
    },
    {
        dataField: "DiscountId",
        text: "Thao Tác",
        formatter: cellButton,
        sort: true
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
                <button className="btn btn-info" onClick={handleClick}>Xuất File</button>
            </div>
        );
    };

    return (
        <div >
            <div className="row">
                <div className="col-sm-12 btn btn-info">
                    Danh Sách Khách Hàng
                </div>
            </div>
            <ToolkitProvider
                keyField="DuscountId"
                data={users}
                columns={columns}
                exportCSV={{
                    fileName: 'khachhang.csv',
                    blobType: 'text/csv;charset=UTF-8'
                }}
            >
                {
                    props => (
                        <div>
                            <BootstrapTable
                                keyField='DiscountId'
                                data={users}
                                columns={columns}
                                tabIndexCell
                                striped
                                hover
                                condensed
                                pagination={paginationFactory()}
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

export default UserTable;