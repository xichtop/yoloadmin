import React, { useState } from 'react'
import { Label, Button, Input, FormGroup } from 'reactstrap'
import sizeAPI from '../api/sizeAPI';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { refresh } from '../slice/productSlice';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function SizeEdit() {

    const history = useHistory();

    const dispatch = useDispatch();

    const sizeList = useSelector(state => state.product.sizes);

    const ProductId = useSelector(state => state.product.ProductId);

    const token = useSelector(state => state.employee.token);

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

    const allSizes = [
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
    ];

    const initialSizes = [];

    allSizes.map((size) => {
        const temp = sizeList.find(item => item === size.size);
        if (temp !== undefined) {
            initialSizes.push({
                checked: true,
                size: size.size
            })
        }
        else {
            initialSizes.push({
                checked: false,
                size: size.size
            })
        }
    })

    const [sizes, setSizes] = useState(initialSizes);
    const handleBoxChange = (index) => {
        const item = {
            size: sizes[index].size,
            productId: ProductId
        };
        console.log(item);
        const fetchCheckColor = async () => {
            var result = null;
            try {
                result = await sizeAPI.checkSize(item, token);

            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }

            if (result.successful === true) {
                store.addNotification({
                    title: "Size ???? t???n t???i trong ????n h??ng!!",
                    message: `Kh??ng th??? ch???nh s???a`,
                    type: "warning",
                    ...configNotify
                });
            } else {
                const sizeTemp = [...sizes.slice(0, index), {
                    checked: !sizes[index].checked,
                    size: sizes[index].size
                },
                ...sizes.slice(index + 1)
                ];
                setSizes(sizeTemp);
            }
        }
        fetchCheckColor();
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
            alert('Vui l??ng ch???n size!')
        } else {
            sizes.forEach(size => {
                if (size.checked === true) {
                    sizeTemps.push(size.size);
                }
            })

            const item = {
                ProductId: ProductId,
                sizes: sizeTemps,
            }
            console.log(item);
            confirmAlert({
                title: 'S???a M??u',
                message: 'B???n c?? ch???c ch???c mu???n s???a nh???ng m??u n??y kh??ng?',
                buttons: [
                    {
                        label: 'C??',
                        onClick: () => fetchEditSize()
                    },
                    {
                        label: 'Kh??ng',
                        onClick: () => {
                            history.push(`/editsize`);
                        }
                    }
                ],
                closeOnEscape: true,
                closeOnClickOutside: true,
            });

            const fetchEditSize = async () => {
                var result = null;
                try {
                    result = await sizeAPI.update(item, token);

                } catch (error) {
                    console.log("Failed to fetch options: ", error);
                }

                if (result.successful == true) {
                    store.addNotification({
                        title: "Wonderfull!",
                        message: `S???a size th??nh c??ng!`,
                        type: "success",
                        ...configNotify
                    });
                    const action = refresh();
                    dispatch(action);
                    history.push(`/product`);
                } else {
                    store.addNotification({
                        title: "Error!",
                        message: `S???a size th???t b???i, vui l??ng th??? l???i sau!`,
                        type: "danger",
                        ...configNotify
                    });
                    const action = refresh();
                    dispatch(action);
                    history.push(`/product`);
                }
            }
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
                    <h2>S???A SIZE</h2>
                    <FormGroup>
                        <div >
                            <Label for="exampleCheckbox">Vui l??ng ch???n c??c size c???a s???n ph???m</Label>
                            <div className="color-picker">
                                {sizes.map((size, index) => (
                                    <FormGroup check inline style={{
                                        fontSize: "1.6rem"
                                    }} key={index}>
                                        <Label check className="color-picker-item">
                                            <Input type="checkbox" style={{
                                                cursor: "pointer"
                                            }} onChange={() => handleBoxChange(index)} checked={size.checked} /> {size.size}
                                        </Label>
                                    </FormGroup>
                                ))}
                            </div>
                            <Label for="exampleCheckbox">C??c size ???? ch???n:
                                {sizes.map(size => (
                                    size.checked === true ? <span style={{ color: "red", fontSize: "1.2rem", paddingLeft: "10px" }}>{size.size}</span>
                                        :
                                        <span></span>
                                ))}
                            </Label>
                        </div>
                    </FormGroup>
                    <Button color='success' onClick={handleConfirm}>
                        Ti???n h??nh x??c nh???n
                    </Button>{' '}
                    <Button color='danger' onClick={handleCancel}>
                        H???y
                    </Button>
                </div>
            </div>
        </div>
    )
}