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
                    message: `K??ch ho???t s???n ph???m th??nh c??ng!`,
                    type: "success",
                    ...configNotify
                });
                handleCheck();
                history.push('/product');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `K??ch ho???t s???n ph???m th???t b???i, vui l??ng th??? l???i sau!`,
                    type: "warning",
                    ...configNotify
                });
                handleCheck();
                history.push('/product');
            }
        }
        confirmAlert({
            title: 'K??ch Ho???t S???n Ph???m',
            message: 'B???n c?? ch???c ch???c mu???n k??ch ho???t s???n ph???m n??y kh??ng?',
            buttons: [
                {
                    label: 'C??',
                    onClick: () => fetchUpdateProduct()
                },
                {
                    label: 'Kh??ng',
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
                    message: `???n s???n ph???m th??nh c??ng!`,
                    type: "success",
                    ...configNotify
                });
                handleCheck();
                history.push('/product');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `???n s???n ph???m th???t b???i, vui l??ng th??? l???i sau!`,
                    type: "warning",
                    ...configNotify
                });
                handleCheck();
                history.push('/product');
            }
        }
        confirmAlert({
            title: '???n S???n Ph???m',
            message: 'B???n c?? ch???c ch???c mu???n ???n s???n ph???m n??y kh??ng?',
            buttons: [
                {
                    label: 'C??',
                    onClick: () => fetchUpdateProduct()
                },
                {
                    label: 'Kh??ng',
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
                    <ButtonToggle color="info" onClick={hanleActive}>K??ch Ho???t</ButtonToggle>{' '}
                    <ButtonToggle color="warning" onClick={hanleActive}>S???a</ButtonToggle>{' '}
                    <ButtonToggle color="success" onClick={hanleQuantity}>Nh???p H??ng</ButtonToggle>
                </td>
                :
                <td>
                    <ButtonToggle color="danger" onClick={hanleLock}>???n</ButtonToggle>{' '}
                    <ButtonToggle color="warning" onClick={hanleChange}>S???a</ButtonToggle>{' '}
                    <ButtonToggle color="success" onClick={hanleQuantity}>Nh???p H??ng</ButtonToggle>
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
        AT: "??o Thun",
        SM: "??o S?? Mi",
        QJ: "Qu???n Jean",
        VI: "V??",
        GI: "Gi??y",
        BL: "Balo"
    }

    const collections = {
        MX2021: "M??a Xu??n",
        MT2021: "M??a H??",
        MH2021: "M??a Thu",
        MD2021: "M??a ????ng"
    }

    const forms = {
        ExtraSlim: "Thon g???n",
        Fitted: "V???a v???n",
        Regular: "Th?????ng",
        Oversize: "Qu?? c???"
    }

    const columns = [
        {
            dataField: 'URLPicture',
            text: 'H??nh ???nh',
            headerStyle: { width: '50px' },
            formatter: cell => (<img src={cell} style={{
                width: '40px',
                objectFit: 'contain'
            }} />)
        },
        {
            dataField: 'ProductId',
            text: 'M?? s???n ph???m',
            sort: true,
            filter: textFilter({ placeholder: 'M?? s???n ph???m ...', }),
            style: {
                fontWeight: 'bold',
            },
            headerStyle: {
                width: '100px',
            }
        }, {
            dataField: 'Title',
            text: 'Ti??u ?????',
            sort: true,
            filter: textFilter({ placeholder: 'Ti??u ????? ...', }),
            headerStyle: {
                width: '120px',
            }
        }, {
            dataField: 'CategoryId',
            text: 'Danh m???c',
            sort: true,
            headerStyle: { width: '120px' },
            formatter: cell => categoties[cell],
            filter: selectFilter({
                options: categoties,
                placeholder: "Danh m???c ..."
            })
        }, 
        {
            dataField: 'CollectionId',
            text: 'B??? s??u t???p',
            sort: true,
            headerStyle: { width: '120px' },
            formatter: cell => collections[cell],
            filter: selectFilter({
                options: collections,
                placeholder: "B??? s??u t???p ..."
            })
        },
        {
            dataField: 'FormId',
            text: 'Ki???u d??ng',
            sort: true,
            headerStyle: { width: '120px' },
            formatter: cell => forms[cell],
            filter: selectFilter({
                options: forms,
                placeholder: "Ki???u d??ng ..."
            })
        },
        {
            dataField: 'Material',
            text: 'Ch???t li???u',
            sort: true,
            filter: textFilter({ placeholder: 'Ch???t li???u ...', }),
            headerStyle: {
                width: '100px',
            }
        },
        {
            dataField: 'Style',
            text: 'Phong c??ch',
            sort: true,
            headerStyle: { width: '100px' },
            filter: textFilter({ placeholder: 'Phong c??ch ...', }),
        },
        {
            dataField: 'CreatedDate',
            text: 'Ng??y t???o / s???a',
            sort: true,
            headerStyle: { width: '180px' },
            formatter: cell => cell.split('T')[0],
            filter: dateFilter()
        }, {
            dataField: 'UnitPrice',
            text: 'Gi??',
            sort: true,
            headerStyle: { width: '100px' },
            formatter: cell => numberWithCommas(cell),
            filter: numberFilter({ placeholder: 'Nh???p gi?? ...', })
        },  {
            dataField: 'Quantity',
            text: 'S??? l?????ng',
            sort: true,
            headerStyle: { width: '110px' },
            filter: numberFilter({ placeholder: 'Nh???p s??? l?????ng ...', })
        }, {
            dataField: 'Sold',
            text: '???? b??n',
            sort: true,
            headerStyle: { width: '100px' },
            filter: numberFilter({ placeholder: 'Nh???p s??? l?????ng ...', })
        }, {
            dataField: 'Status',
            text: 'Tr???ng th??i',
            sort: true,
            headerStyle: { width: '80px' },
            formatter: cell => selectOptions[cell],
            filter: selectFilter({
                options: selectOptions
            })
        },
        {
            text: "Thao T??c",
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
                    <CardTitle tag="h5">Chi ti???t s???n ph???m</CardTitle>
                    <CardBody>
                        <Table striped hover bordered responsive>
                            <tbody>
                                <tr>
                                    <th>M??u</th>
                                    {product.colors.map(color => (
                                        <td>{color.Color}</td>
                                    ))}
                                    <td><ButtonToggle color="warning" onClick={() => handleChangeColor(product)}>S???a M??u</ButtonToggle>{' '}</td>
                                </tr>
                                <tr>
                                    <th>Size</th>
                                    {product.sizes.map(size => (
                                        <td>{size}</td>
                                    ))}
                                    <td><ButtonToggle color="warning" onClick={() => handleChangeSize(product)}>S???a Size</ButtonToggle>{' '}</td>
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
                <button className="btn btn-info" onClick={handleClick}>Xu???t File</button>
            </div>
        );
    };


    return (
        <div >
            <div className="row">
                <div className="col-sm-12 btn btn-info">
                    Danh S??ch S???n Ph???m
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
                            <MyExportCSV {...props.csvProps}>Xu???t File Excel!!</MyExportCSV>
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
                <ButtonToggle color="success" size="lg" onClick={handleAddProduct}>Th??m s???n ph???m m???i</ButtonToggle>{' '}
            </div>

        </div>
    )
}

export default UserTable;