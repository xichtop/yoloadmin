import React, { useState } from 'react'
import colors from '../assets/colors';
import Switch from "react-switch";
import { Label, Button, Input, } from 'reactstrap'
import colorApi from '../api/colorAPI';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { refresh } from '../slice/productSlice';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

// confirm alert
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import firebase from '../firebase/firebase'

export default function ColorEdit() {

    const history = useHistory();

    const dispatch = useDispatch();

    const colorList = useSelector(state => state.product.colors);

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

    let ColorTemp = [];
    colors.forEach(color => {
        const temp = colorList.find(colorItem => colorItem.Color === color.english);
        console.log(temp);
        if (temp !== undefined) {
            const colorItem = {
                checked: true,
                color: color.color,
                english: color.english,
                img: null,
                URL: temp.URLPicture,
            }
            ColorTemp.push(colorItem);
        } else {
            const colorItem = {
                checked: false,
                color: color.color,
                english: color.english,
                img: null,
                URL: null,
            }
            ColorTemp.push(colorItem);
        }
    })

    const [colorItems, setColorItems] = useState(ColorTemp);

    const handleSwitchChange = (index) => {
        const item = {
            color: colorItems[index].english,
            productId: ProductId
        };
        console.log(item);
        const fetchCheckColor = async () => {
            var result = null;
            try {
                result = await colorApi.checkColor(item, token);

            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }

            if (result.successful === true) {
                store.addNotification({
                    title: "Màu đã tồn tại trong đơn hàng!!",
                    message: `Không thể chỉnh sửa`,
                    type: "warning",
                    ...configNotify
                });
            } else {
                var ColorTemp = [];
                const check = colorItems[index].checked;
                ColorTemp = [...colorItems.slice(0, index), {
                    ...colorItems[index],
                    checked: !check,
                }, ...colorItems.slice(index + 1)]
                setColorItems(ColorTemp);
            }
        }
        fetchCheckColor();
    }

    const handleFileChange = (e, index) => {
        if (e.target.files[0]) {
            var ColorTemp = [];
            ColorTemp = [...colorItems.slice(0, index), {
                ...colorItems[index], img: e.target.files[0]
            }, ...colorItems.slice(index + 1)]
            setColorItems(ColorTemp);
        }
    }

    const handleUpload = (index) => {
        if (colorItems[index].img === null) {
            alert('Vui lòng chọn ảnh trước khi upload!!!');
        } else {
            let file = colorItems[index].img;
            var storage = firebase.storage();
            var storageRef = storage.ref();
            var uploadTask = storageRef.child('folder/' + file.name).put(file);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
                    // setImg({
                    //     ...img,
                    //     progress: progress
                    // })
                }, (error) => {
                    throw error
                }, () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                        var ColorTemp = [];
                        ColorTemp = [...colorItems.slice(0, index), {
                            ...colorItems[index], URL: url
                        }, ...colorItems.slice(index + 1)]
                        setColorItems(ColorTemp);
                    })
                    document.getElementById("file").value = null;
                    store.addNotification({
                        title: "Wonderfull!",
                        message: `Upload ảnh thành công!`,
                        type: "success",
                        ...configNotify
                    });
                }
            )
        }
    }

    const handleSubmit = () => {
        var check = false;
        var colors = [];
        colorItems.forEach(color => {
            if (color.checked === true) {
                check = true;
            }
        })
        if (!check) {
            alert('Vui lòng chọn màu!')
        }
        else {
            check = false;
            colorItems.forEach(color => {
                if (color.checked === true && color.URL === null) {
                    check = true;
                }
            })
            if (check) {
                alert('Vui lòng upload tất cả ảnh!')
            } else {
                colorItems.forEach(color => {
                    if (color.checked === true && color.URL !== null) {
                        colors.push({
                            URLPicture: color.URL,
                            English: color.english,
                        })
                    }
                })

                const item = {
                    ProductId: ProductId,
                    colors: colors
                }

                confirmAlert({
                    title: 'Sửa Màu',
                    message: 'Bạn có chắc chắc muốn sửa những màu này không?',
                    buttons: [
                        {
                            label: 'Có',
                            onClick: () => fetchEditColor()
                        },
                        {
                            label: 'Không',
                            onClick: () => {
                                history.push(`/editcolor`);
                            }
                        }
                    ],
                    closeOnEscape: true,
                    closeOnClickOutside: true,
                });

                const fetchEditColor = async () => {
                    var result = null;
                    try {
                        result = await colorApi.update(item, token);

                    } catch (error) {
                        console.log("Failed to fetch options: ", error);
                    }

                    if (result.successful == true) {
                        store.addNotification({
                            title: "Wonderfull!",
                            message: `Sửa màu thành công!`,
                            type: "success",
                            ...configNotify
                        });
                        const action = refresh();
                        dispatch(action);
                        history.push(`/product`);
                    } else {
                        store.addNotification({
                            title: "Error!",
                            message: `Sửa màu thất bại, vui lòng thử lại sau!`,
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
                    <h2>SỬA MÀU</h2>
                    <div className="color-picker">
                        {colors.map((color, index) => (
                            <div className="color-picker-item" key={index}>
                                <div className="color-picker-span" style={{
                                    backgroundColor: color.color,
                                }}>
                                </div>
                                <Switch onChange={() => handleSwitchChange(index)} checked={colorItems[index].checked} onColor={color.color} />
                            </div>
                        ))}
                    </div>
                    <div className="img-picker">
                        {colorItems.map((colorItem, index) => (
                            colorItem.checked === true ?
                                <div>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        paddingBottom: "5px",
                                    }}>
                                        <Label for="exampleFile" style={{
                                            paddingRight: 10
                                        }}>Hình ảnh</Label>
                                        <Input type="file" name="file" id="file" onChange={(e) => handleFileChange(e, index)} />
                                        <Button style={{
                                            marginRight: "10px",
                                            backgroundColor: colorItem.color,
                                            color: colorItem.color === "#F8F8F8" ? "Black" : "White"
                                        }}
                                            onClick={() => handleUpload(index)}
                                        >Upload</Button>
                                        <img
                                            className="ref"
                                            src={colorItem.URL || "https://via.placeholder.com/60x60"}
                                            alt="Uploaded Images"
                                            height="60"
                                            width="60"
                                            objectfit="cover"
                                        />

                                    </div>
                                </div>
                                :
                                <div />
                        ))}
                    </div>
                    <Button color='success' onClick={handleSubmit}>
                        Xác Nhận
                    </Button>{' '}
                    <Button color='danger' onClick={handleCancel}>
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    )
}