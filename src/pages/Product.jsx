import React, { useEffect, useState } from 'react';
import productAPI from '../api/productAPI';
import { Table, Pagination, PaginationItem, PaginationLink, ButtonToggle, Collapse, Card, CardTitle, CardBody, Button } from 'reactstrap';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { useHistory } from "react-router-dom";

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const UserTable = () => {

    const history = useHistory();

    const [check, setCheck] = useState(false);

    const [products, setProducts] = useState([]);

    const [productsTemp, setProductsTemp] = useState([]);

    const [paginationMax, setPaginationMax] = useState(1);

    const [paginationIndex, setPaginationIndex] = useState(1);

    const [paginationBetween, setPaginationBetween] = useState(2);

    const [collapses, setCollapses] = useState([]);

    const toggle = (index) => {
        const collapseTemps = [...collapses.slice(0, index), !collapses[index], ...collapses.slice(index + 1)];
        setCollapses(collapseTemps);
    };

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
            var products = [];
            try {
                products = await productAPI.getAllAdmin();
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            console.log(products);
            setProducts(products);
            setProductsTemp(products.slice(0, 10));
            const pagiMax = Math.floor(products.length / 10) + 1;
            setPaginationMax(pagiMax);
            var collapseTemps = [];
            for (let i = 0; i < products.length; i++) {
                collapseTemps.push(false);
            }
            setCollapses(collapseTemps);
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchproducts = async () => {
            var products = [];
            try {
                products = await productAPI.getAllAdmin();
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            console.log(products);
            setProducts(products);
            const newProducts = products.slice(10 * (paginationIndex - 1), 10 * paginationIndex);
            setProductsTemp(newProducts);
            setCheck(false);
        }
        fetchproducts();
    }, [check]);

    useEffect(() => {
        const newProducts = products.slice(10 * (paginationIndex - 1), 10 * paginationIndex);
        setProductsTemp(newProducts);
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

    const hanleActive = (ProductId) => {
        const newProduct = {
            ProductId: ProductId.trim(),
            newStatus: 'On',
        }
        const fetchUpdateProduct = async () => {
            var result = {};
            try {
                result = await productAPI.updateStatus(newProduct);
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
                setCheck(true);
                history.push('/product');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Kích hoạt sản phẩm thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                setCheck(true);
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

    const hanleLock = (ProductId) => {
        const newProduct = {
            ProductId: ProductId.trim(),
            newStatus: 'Off',
        }
        const fetchUpdateProduct = async () => {
            var result = {};
            try {
                result = await productAPI.updateStatus(newProduct);
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
                setCheck(true);
                history.push('/product');
            } else {
                store.addNotification({
                    title: "Error!",
                    message: `Ẩn sản phẩm thất bại, vui lòng thử lại sau!`,
                    type: "warning",
                    ...configNotify
                });
                setCheck(true);
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

    const hanleChange = (ProductId) => {

    }

    const handleAddProduct = () => {
        history.push('/addproduct');
    }

    return (
        <div >
            <div className="row">
                <div className="col-sm-12 btn btn-info">
                    Danh Sách Sản Phẩm
                </div>
            </div>
            <div>
                <Table striped hover bordered responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Mã Sản Phẩm</th>
                            <th>Tiêu Đề</th>
                            <th>Ngày tạo / sửa</th>
                            <th>Giá mới</th>
                            <th>Giá cũ</th>
                            <th>Số lượng</th>
                            <th>Đã bán</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsTemp.map((product, index) => (
                            <>
                                <tr >
                                    <td>
                                        <div>
                                            <Button color="primary" onClick={() => toggle(index)} >+</Button>
                                        </div>
                                    </td>
                                    <td>{product.ProductId}</td>
                                    <td>{product.Title}</td>
                                    <td>{product.CreatedDate.slice(0, 10)}</td>
                                    <td>{product.UnitPrice}</td>
                                    <td>{product.OldPrice}</td>
                                    <td>{product.Quantity}</td>
                                    <td>{product.Sold}</td>
                                    <td>{product.Status}</td>
                                    {product.Status.trim() === 'Off' ?
                                        <td>
                                            <ButtonToggle color="info" onClick={() => hanleActive(product.ProductId)}>Kích Hoạt</ButtonToggle>{' '}
                                            <ButtonToggle color="success" onClick={() => hanleActive(product.ProductId)}>Sửa</ButtonToggle>
                                        </td>
                                        :
                                        <td>
                                            <ButtonToggle color="danger" onClick={() => hanleLock(product.ProductId)}>Ẩn</ButtonToggle>{' '}
                                            <ButtonToggle color="success" onClick={() => hanleChange(product.ProductId)}>Sửa</ButtonToggle>
                                        </td>
                                    }
                                </tr>
                                <tr>
                                    <Collapse
                                        isOpen={collapses[index]}
                                    >
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
                                                        </tr>
                                                        <tr>
                                                            <th>Size</th>
                                                            {product.sizes.map(size => (
                                                                <td>{size}</td>
                                                            ))}
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                        </Card>
                                    </Collapse>
                                </tr>
                            </>
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