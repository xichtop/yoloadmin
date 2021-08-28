import React, { useState, useEffect } from 'react'
import colors from '../assets/colors';
import Switch from "react-switch";
import { Label, Button, Input, } from 'reactstrap'

import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { updateColor, refresh } from '../slice/productSlice';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import firebase from '../firebase/firebase'

export default function ColorRegister() {

    const history = useHistory();

    const dispatch = useDispatch();

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
        const colorItem = {
            checked: false,
            color: color.color,
            english: color.english,
            img: null,
            URL: null,
        }
        ColorTemp.push(colorItem);
    })

    const [colorItems, setColorItems] = useState(ColorTemp);

    const handleSwitchChange = (index) => {
        var ColorTemp = [];
        const check = colorItems[index].checked;
        ColorTemp = [...colorItems.slice(0, index), {
            ...colorItems[index],
            checked: !check,
            // img: null,
            // color: colors[index].color,
            // english: colors[index].english,
            // URL: null,
        }, ...colorItems.slice(index + 1)]
        setColorItems(ColorTemp);
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

    const handleNext = () => {
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
                            Color: color.color,
                            URLPicture: color.URL,
                            English: color.english,
                        })
                    }
                })
                const action = updateColor(colors);
                dispatch(action);
                history.push('/productsize');
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
                    <h2>ĐĂNG KÝ MÀU</h2>
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
                    <Button color='success' onClick={handleNext}>
                        Tiếp theo
                    </Button>{' '}
                    <Button color='danger' onClick={handleCancel}>
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    )
}