import React, { useEffect, useState } from 'react';
import userAPI from '../api/userAPI';
import { Table, Pagination, PaginationItem, PaginationLink, ButtonToggle } from 'reactstrap';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { useHistory } from "react-router-dom";

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const UserTable = () => {

    const history = useHistory();

    const [check, setCheck] = useState(false);

    const [users, setUsers] = useState([]);

    const [usersTemp, setUsersTemp] = useState([]);

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
            var users = [];
            try {
                users = await userAPI.getAll();
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            console.log(users);
            setUsers(users);
            setUsersTemp(users.slice(0, 10));
            const pagiMax = Math.floor(users.length / 10) + 1;
            setPaginationMax(pagiMax);
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            var users = [];
            try {
                users = await userAPI.getAll();
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            console.log(users);
            setUsers(users);
            const newUsers = users.slice(10 * (paginationIndex - 1), 10 * paginationIndex);
            setUsersTemp(newUsers);
            setCheck(false);
        }
        fetchUsers();
    }, [check]);

    useEffect(() => {
        const newUsers = users.slice(10 * (paginationIndex - 1), 10 * paginationIndex);
        setUsersTemp(newUsers);
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

    const hanleActive = (email) => {
        const newUser = {
            email: email.trim(),
            newStatus: 'On',
        }
        const fetchUpdateUser = async () => {
            var result = {};
            try {
                result = await userAPI.updateStatus(newUser);
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
                setCheck(true);
                history.push('/user');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Kích hoạt tài khoản thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                setCheck(true);
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

    const hanleLock = (email) => {
        const newUser = {
            email: email.trim(),
            newStatus: 'Off',
        }
        const fetchUpdateUser = async () => {
            var result = {};
            try {
                result = await userAPI.updateStatus(newUser);
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
                setCheck(true);
                history.push('/user');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Khóa tài khoản thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                setCheck(true);
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
        <div >
            <div className="row">
                <div className="col-sm-12 btn btn-info">
                    Danh Sách Khách Hàng
                </div>
            </div>
            <div style={{
                height: "500px"
            }} >
                <Table striped hover bordered responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Họ và Tên</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Trạng Thái</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersTemp.map((user, index) => (
                            <tr key={index} >
                                <th scope="row">{index + 1}</th>
                                <td>{user.Email}</td>
                                <td>{user.FullName}</td>
                                <td>{user.Phone}</td>
                                <td>{user.Address}</td>
                                <td>{user.Status}</td>
                                {user.Status.trim() === 'Off' ?
                                    <td>
                                        <ButtonToggle color="info" onClick={() => hanleActive(user.Email)}>Kích Hoạt</ButtonToggle>
                                    </td>
                                    :
                                    <td>
                                        <ButtonToggle color="danger" onClick={() => hanleLock(user.Email)}>Khóa</ButtonToggle>
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

export default UserTable;