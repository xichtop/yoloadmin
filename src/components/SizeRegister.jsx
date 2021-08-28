import React, { useState } from 'react'
import { Label, Button, Input, FormGroup } from 'reactstrap'

import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { updateSize, refresh } from '../slice/productSlice';

export default function SizeRegister() {

    const history = useHistory();

    const dispatch = useDispatch();

    const [sizes, setSizes] = useState([
        {
            checked: false,
            size: "S"
        },
        {
            checked: false,
            size: "M"
        },
        {
            checked: false,
            size: "L"
        },
        {
            checked: false,
            size: "XL"
        }
    ]);

    const handleBoxChange = (index) => {
        const sizeTemp = [...sizes.slice(0, index), {
                checked: !sizes[index].checked,
                size: sizes[index].size
            },
            ...sizes.slice(index + 1)
        ];
        setSizes(sizeTemp);
    }

    const handleConfirm = () => {
        var check = false;
        var sizeTemps = []
        sizes.forEach(size => {
            if (size.checked === true) {
                check = true;
            }
        })
        if (!check) {
            alert('Vui lòng chọn size!')
        } else {
            sizes.forEach(size => {
                if (size.checked === true) {
                    sizeTemps.push(size.size);
                }
            })
            const action = updateSize(sizeTemps);
            dispatch(action);
            history.push('/productconfirm');
        }
    }

    const handleCancel = () => {
        const action = refresh();
        dispatch(action);
        history.push('/product');
    }

    return (
        <div className="login" >
            <div className="box" >
                <div className="login-box" style={{
                    width: "600px"
                }}>
                    <h2>ĐĂNG KÝ SIZE</h2>
                    <FormGroup>
                        <div >
                            <Label for="exampleCheckbox">Vui lòng chọn các size của sản phẩm</Label>
                            <div className="color-picker">
                                {sizes.map((size, index) => (
                                    <FormGroup check inline style={{
                                        fontSize: "1.6rem"
                                    }} key = {index}>
                                        <Label check className="color-picker-item">
                                            <Input type="checkbox" style={{
                                            cursor: "pointer"
                                        }} onChange={() => handleBoxChange(index)} checked = {size.checked}/> {size.size}
                                        </Label>
                                    </FormGroup>
                                ))}
                            </div>
                            <Label for="exampleCheckbox">Các size đã chọn: 
                                {sizes.map(size => (
                                    size.checked === true ? <span style={{color: "red", fontSize: "1.2rem", paddingLeft: "10px"}}>{size.size}</span>
                                :
                                <span></span>
                                ))}
                            </Label>
                        </div>
                    </FormGroup>
                    <Button color='success' onClick={handleConfirm}>
                        Tiến hành xác nhận
                    </Button>{' '}
                    <Button color='danger' onClick={handleCancel}>
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    )
}