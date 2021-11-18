import React, { useEffect, useState } from 'react';
import productAPI from '../api/productAPI';
import numberWithCommas from '../utils/numberWithCommas';
import { Table, Pagination, PaginationItem, PaginationLink, ButtonToggle, Collapse, Card, CardTitle, CardBody, Button } from 'reactstrap';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { add } from '../slice/productSlice';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// React bootstrap table
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, numberFilter, dateFilter, selectFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

const EditButton = (props) => {

    const dispatch = useDispatch();

    const token = useSelector(state => state.employee.token);

    const history = useHistory();

    const productId = props.row.ProductId;

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

    const hanleQuantity = () => {
        history.push(`/updateQuantity/${productId}`);
    }

    const hanleActive = () => {
        const newProduct = {
            ProductId: productId.trim(),
            newStatus: 'On',
        }
        const fetchUpdateProduct = async () => {
            var result = {};
            try {
                result = await productAPI.updateStatus(newProduct, token);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `Kích hoạt sản phẩm thành công!`,
                    type: "success",
                    ...configNotify
                });
                handleCheck();
                history.push('/product');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Kích hoạt sản phẩm thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                handleCheck();
                history.push('/product');
            }
        }
        confirmAlert({
            title: 'Kích Hoạt Sản Phẩm',
            message: 'Bạn có chắc chắc muốn kích hoạt sản phẩm này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => fetchUpdateProduct()
                },
                {
                    label: 'Không',
                    onClick: () => {
                        history.push('/product');
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    }

    const hanleLock = () => {
        const newProduct = {
            ProductId: productId.trim(),
            newStatus: 'Off',
        }
        const fetchUpdateProduct = async () => {
            var result = {};
            try {
                result = await productAPI.updateStatus(newProduct, token);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderfull!",
                    message: `Ẩn sản phẩm thành công!`,
                    type: "success",
                    ...configNotify
                });
                handleCheck();
                history.push('/product');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Ẩn sản phẩm thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                handleCheck();
                history.push('/product');
            }
        }
        confirmAlert({
            title: 'Ẩn Sản Phẩm',
            message: 'Bạn có chắc chắc muốn ẩn sản phẩm này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => fetchUpdateProduct()
                },
                {
                    label: 'Không',
                    onClick: () => {
                        history.push('/product');
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    }

    const hanleChange = () => {
        const fetchProduct = async () => {
            var product = {};
            try {
                product = await productAPI.get(productId);
            } catch (error) {
                console.log("Failed to fetch order list: ", error);
            }

            const action = add(product);
            dispatch(action);
            history.push(`/editproduct`);
        }
        fetchProduct();
    }

    return (
        <div>
            {Status.trim() === 'Off' ?
                <td>
                    <ButtonToggle color="info" onClick={hanleActive}>Kích Hoạt</ButtonToggle>{' '}
                    <ButtonToggle color="warning" onClick={hanleActive}>Sửa</ButtonToggle>{' '}
                    <ButtonToggle color="success" onClick={hanleQuantity}>Nhập Hàng</ButtonToggle>
                </td>
                :
                <td>
                    <ButtonToggle color="danger" onClick={hanleLock}>Ẩn</ButtonToggle>{' '}
                    <ButtonToggle color="warning" onClick={hanleChange}>Sửa</ButtonToggle>{' '}
                    <ButtonToggle color="success" onClick={hanleQuantity}>Nhập Hàng</ButtonToggle>
                </td>
            }
        </div>
    );
};

const UserTable = () => {

    const history = useHistory();

    const dispatch = useDispatch();

    const token = useSelector(state => state.employee.token);

    const [check, setCheck] = useState(false);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            var products = [];
            try {
                products = await productAPI.getAllAdmin(token);
                // console.log(products);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setProducts(products);
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchproducts = async () => {
            var products = [];
            try {
                products = await productAPI.getAllAdmin(token);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            console.log(products);
            setProducts(products);
        }
        fetchproducts();
    }, [check]);

    const handleAddProduct = () => {
        history.push('/addproduct');
    }

    const handleChangeColor = (product) => {
        const action = add(product);
        dispatch(action);
        history.push(`/editcolor`);
    }

    const handleChangeSize = (product) => {
        const action = add(product);
        dispatch(action);
        history.push(`/editsize`);
    }

    const handleCheck = () => {
        setCheck(!check);
    }

    const cellButton = (cell, row, rowIndex) => (
        <EditButton cell={cell} row={row} rowIndex={rowIndex} handleCheck={handleCheck} />
    );

    const selectOptions = {
        On: 'On',
        Off: 'Off',
    };

    const categoties = {
        AT: "Áo Thun",
        SM: "Áo Sơ Mi",
        QJ: "Quần Jean",
        VI: "Ví",
        GI: "Giày",
        BL: "Balo"
    }

    const collections = {
        MX2021: "Mùa Xuân",
        MT2021: "Mùa Hè",
        MH2021: "Mùa Thu",
        MD2021: "Mùa Đông"
    }

    const forms = {
        ExtraSlim: "Thon gọn",
        Fitted: "Vừa vặn",
        Regular: "Thường",
        Oversize: "Quá cỡ"
    }

    const columns = [
        {
            dataField: 'URLPicture',
            text: 'Hình ảnh',
            headerStyle: { width: '50px' },
            formatter: cell => (<img src={cell} style={{
                width: '40px',
                objectFit: 'contain'
            }} />)
        },
        {
            dataField: 'ProductId',
            text: 'Mã sản phẩm',
            sort: true,
            filter: textFilter({ placeholder: 'Mã sản phẩm ...', }),
            style: {
                fontWeight: 'bold',
            },
            headerStyle: {
                width: '100px',
            }
        }, {
            dataField: 'Title',
            text: 'Tiêu đề',
            sort: true,
            filter: textFilter({ placeholder: 'Tiêu đề ...', }),
            headerStyle: {
                width: '120px',
            }
        }, {
            dataField: 'CategoryId',
            text: 'Danh mục',
            sort: true,
            headerStyle: { width: '120px' },
            formatter: cell => categoties[cell],
            filter: selectFilter({
                options: categoties,
                placeholder: "Danh mục ..."
            })
        }, 
        {
            dataField: 'CollectionId',
            text: 'Bộ sưu tập',
            sort: true,
            headerStyle: { width: '120px' },
            formatter: cell => collections[cell],
            filter: selectFilter({
                options: collections,
                placeholder: "Bộ sưu tập ..."
            })
        },
        {
            dataField: 'FormId',
            text: 'Kiểu dáng',
            sort: true,
            headerStyle: { width: '120px' },
            formatter: cell => forms[cell],
            filter: selectFilter({
                options: forms,
                placeholder: "Kiểu dáng ..."
            })
        },
        {
            dataField: 'Material',
            text: 'Chất liệu',
            sort: true,
            filter: textFilter({ placeholder: 'Chất liệu ...', }),
            headerStyle: {
                width: '100px',
            }
        },
        {
            dataField: 'Style',
            text: 'Phong cách',
            sort: true,
            headerStyle: { width: '100px' },
            filter: textFilter({ placeholder: 'Phong cách ...', }),
        },
        {
            dataField: 'CreatedDate',
            text: 'Ngày tạo / sửa',
            sort: true,
            headerStyle: { width: '180px' },
            formatter: cell => cell.split('T')[0],
            filter: dateFilter()
        }, {
            dataField: 'UnitPrice',
            text: 'Giá',
            sort: true,
            headerStyle: { width: '100px' },
            formatter: cell => numberWithCommas(cell),
            filter: numberFilter({ placeholder: 'Nhập giá ...', })
        },  {
            dataField: 'Quantity',
            text: 'Số lượng',
            sort: true,
            headerStyle: { width: '110px' },
            filter: numberFilter({ placeholder: 'Nhập số lượng ...', })
        }, {
            dataField: 'Sold',
            text: 'Đã bán',
            sort: true,
            headerStyle: { width: '100px' },
            filter: numberFilter({ placeholder: 'Nhập số lượng ...', })
        }, {
            dataField: 'Status',
            text: 'Trạng thái',
            sort: true,
            headerStyle: { width: '80px' },
            formatter: cell => selectOptions[cell],
            filter: selectFilter({
                options: selectOptions
            })
        },
        {
            text: "Thao Tác",
            formatter: cellButton,
            sort: true,
            headerStyle: {
                width: '250px',
            },
        }
    ];

    const PageOptions = {
        sizePerPageList: [{
            text: '5', value: 5
        }, {
            text: '10', value: 10
        }, {
            text: '15', value: 15
        }, {
            text: 'All', value: products.length
        }]
    };

    const expandRow = {
        onlyOneExpanding: true,
        renderer: (row, rowIndex) => {
            const product = products.find(product => product.ProductId === row.ProductId);
            return (
                <Card>
                    <CardTitle tag="h5">Chi tiết sản phẩm</CardTitle>
                    <CardBody>
                        <Table striped hover bordered responsive>
                            <tbody>
                                <tr>
                                    <th>Màu</th>
                                    {product.colors.map(color => (
                                        <td>{color.Color}</td>
                                    ))}
                                    <td><ButtonToggle color="warning" onClick={() => handleChangeColor(product)}>Sửa Màu</ButtonToggle>{' '}</td>
                                </tr>
                                <tr>
                                    <th>Size</th>
                                    {product.sizes.map(size => (
                                        <td>{size}</td>
                                    ))}
                                    <td><ButtonToggle color="warning" onClick={() => handleChangeSize(product)}>Sửa Size</ButtonToggle>{' '}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            );
        },
    };

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
                    Danh Sách Sản Phẩm
                </div>
            </div>
            <ToolkitProvider
                keyField="DuscountId"
                data={products}
                columns={columns}
                exportCSV={{
                    fileName: 'product.csv',
                    blobType: 'text/csv;charset=UTF-8'
                }}
            >
                {
                    props => (
                        <div>
                            <BootstrapTable
                                keyField='DiscountId'
                                data={products}
                                columns={columns}
                                tabIndexCell
                                striped
                                hover
                                condensed
                                pagination={paginationFactory(PageOptions)}
                                filter={filterFactory()}
                                filterPosition="top"
                                expandRow={expandRow}
                                {...props.baseProps} />
                            <hr />
                            <MyExportCSV {...props.csvProps}>Xuất File Excel!!</MyExportCSV>
                            <hr />
                        </div>
                    )
                }
            </ToolkitProvider>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
                <ButtonToggle color="success" size="lg" onClick={handleAddProduct}>Thêm sản phẩm mới</ButtonToggle>{' '}
            </div>

        </div>
    )
}

export default UserTable;