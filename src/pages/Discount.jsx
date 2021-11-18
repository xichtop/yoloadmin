import React, { useEffect, useState } from 'react';
import discountAPI from '../api/discountAPI';
import { useSelector } from 'react-redux';
import { ButtonToggle } from 'reactstrap';
import 'react-notifications-component/dist/theme.css';
import { useHistory } from "react-router-dom";

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

const EditButton = (props) => {
    const history = useHistory();
    const data = props.row;
    const handleEdit = () => {
        history.push(`/discount/edit/${data.DiscountId}/${data.PercentDiscount}/${data.Quantity}`);
        console.log(data);
    }
    return (
        <ButtonToggle color="success" onClick={() => handleEdit()}>Sửa</ButtonToggle>
    );
};

const DiscountTable = () => {

    const history = useHistory();

    const token = useSelector(state => state.employee.token);

    const [discounts, setDiscounts] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            var discounts = [];
            try {
                discounts = await discountAPI.getAll(token);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setDiscounts(discounts);
        }
        fetchOrders();
    }, []);


    const handleAddDiscount = () => {
        history.push('/discount/additem');
    }

    const cellButton = (cell, row, rowIndex) => (
        <EditButton cell={cell} row={row} rowIndex={rowIndex} />
    )

    const columns = [{
        dataField: 'DiscountId',
        text: 'Mã giảm giá',
        sort: true,
        filter: textFilter({ placeholder: 'Nhập mã giảm giá ...', }),
        csvText: 'Mã giảm giá'
    }, {
        dataField: 'PercentDiscount',
        text: 'Phần trăm giảm giá',
        sort: true,
        formatter: cell => cell + " %",
        filter: numberFilter({ placeholder: 'Nhập phần trăm giảm giá ...', })
    }, {
        dataField: 'Quantity',
        text: 'Số lượng',
        sort: true,
        filter: numberFilter({ placeholder: 'Nhập số lượng ...', })
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
            <button className="btn btn-info" onClick={ handleClick }>Xuất File</button>
          </div>
        );
    };

    return (
        <div >
            <div className="row">
                <div className="col-sm-12 btn btn-info">
                    Danh Sách Mã Giảm Giá
                </div>
            </div>
            <ToolkitProvider
                keyField="DuscountId"
                data={discounts}
                columns={columns}
                exportCSV={ {
                    fileName: 'magiamgia.csv',
                    blobType: 'text/csv;charset=UTF-8'
                  } }
            >
                {
                    props => (
                        <div>
                            <BootstrapTable
                            keyField='DiscountId'
                            data={discounts}
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
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
                <ButtonToggle color="success" size="lg" onClick={handleAddDiscount}>Thêm mã giảm giá mới</ButtonToggle>{' '}
            </div>
        </div>
    )
}

export default DiscountTable;