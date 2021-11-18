import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import categoryAPI from '../api/categoryAPI'
import productAPI from '../api/productAPI'
import { refresh } from '../slice/productSlice';

import { Button, FormGroup, Label, Input } from 'reactstrap';
import InputField from '../components/InputField';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import firebase from '../firebase/firebase'

function EditProduct() {

    const product = useSelector(state => state.product);

    const token = useSelector(state => state.employee.token);

    const dispatch = useDispatch();

    const history = useHistory();
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

    const initialValues = {
        ProductId: product.ProductId,
        Title: product.Title,
        Material: product.Material,
        Style: product.Style,
        Description: product.Description,
        UnitPrice: product.UnitPrice,
    }

    const initialImgValues = {
        image: null,
        progress: 0,
        downloadURL: null
    }

    const [img, setImg] = useState(initialImgValues);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImg({
                ...img,
                image: e.target.files[0],
            })
        }
    }

    const handleUpload = () => {
        if (img.image === null) {
            alert('Vui lòng chọn ảnh trước khi upload!!!');
        } else {
            let file = img.image;
            var storage = firebase.storage();
            var storageRef = storage.ref();
            var uploadTask = storageRef.child('folder/' + file.name).put(file);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
                    setImg({
                        ...img,
                        progress: progress
                    })
                }, (error) => {
                    throw error
                }, () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                        setImg({
                            ...img,
                            downloadURL: url
                        })
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

    const handleSubmit = (values) => {
        // console.log('xác nhận');
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
        const neWProduct = {
            ProductId: product.ProductId,
            Description: values.Description,
            URLPicture: img.downloadURL ? img.downloadURL : product.URLPicture,
            UnitPrice: values.UnitPrice,
            Title: values.Title,
            Material: values.Material,
            Style: values.Style,
            OldPrice: values.UnitPrice - 30000,
        }
        console.log(neWProduct);
        const fetchUpdate = async () => {
            var result = null;
            try {
                result = await productAPI.update(neWProduct, token);
            } catch (error) {
                console.log("Failed to fetch user: ", error);
            }
            if (result.successful == true) {
                store.addNotification({
                    title: "Wonderful!",
                    message: `Chỉnh sửa sản phẩm thành công`,
                    type: "success",
                    ...configNotify
                });
                history.push('/product');
            } else {
                store.addNotification({
                    title: "Chỉnh sửa thất bại!",
                    message: `Đã có lỗi xảy ra, vui lòng thử lại sau!`,
                    type: "danger",
                    ...configNotify
                });
                history.push('/product');
            }
        }
        fetchUpdate();
    }

    const handleCancel = () => {
        const action = refresh();
        dispatch(action);
        history.push('/product');
    }

    var CATEGORY_OPTIONS = [];

    useEffect(() => {
        const fetchOptions = async () => {
            var categories = [];
            try {
                categories = await categoryAPI.getAll();
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            console.log(categories);
            categories.forEach(category => {
                CATEGORY_OPTIONS.push({
                    value: category.CategoryId,
                    label: category.Description,
                });
            });
        }
        fetchOptions();
    }, [])

    const validationSchema = Yup.object().shape({
        Title: Yup.string().required('Tiêu đề không được bỏ trống'),
        Material: Yup.string().required('Chất liệu không được bỏ trống'),
        Style: Yup.string().required('Phong cách không được bỏ trống'),
        Description: Yup.string().required('Mô tả không được bỏ trống'),
        UnitPrice: Yup.number().min(1, 'Giá phải lớn hơn 0').integer('Giá phải là số nguyên').required('Giá mới không được bỏ trống'),
    });

    return (
        <div className="login">
            <div className="box">
                <div className="login-box" >
                    <h2>SỬA SẢN PHẨM</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {formikProps => {
                            // do something here ...
                            const { values, errors, touched } = formikProps;

                            return (
                                <Form>
                                    <FastField
                                        name="ProductId"
                                        component={InputField}

                                        label="Mã sản phẩm"
                                        placeholder="Nhập tiêu đề sản phẩm ..."
                                        type="text"
                                        disabled="true"
                                    />
                                    <FastField
                                        name="Title"
                                        component={InputField}

                                        label="Tiêu đề"
                                        placeholder="Nhập tiêu đề sản phẩm ..."
                                        type="text"
                                    />

                                    <FastField
                                        name="Description"
                                        component={InputField}

                                        label="Mô tả"
                                        placeholder="Nhập mô tả của sản phẩm ..."
                                        type="textarea"
                                    />
                                     <FastField
                                        name="Material"
                                        component={InputField}

                                        label="Chất liệu"
                                        placeholder="Nhập chất liệu sản phẩm ..."
                                        type="text"
                                    />
                                     <FastField
                                        name="Style"
                                        component={InputField}

                                        label="Phong cách"
                                        placeholder="Nhập phong cách sản phẩm ..."
                                        type="text"
                                    />
                                    <FastField
                                        name="UnitPrice"
                                        component={InputField}

                                        label="Giá"
                                        placeholder="Nhập giá của sản phẩm ..."
                                        type="number"
                                    />
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "10px 0"
                                    }}>
                                        <Label for="exampleFile" style={{
                                            paddingRight: 10
                                        }}>Hình ảnh</Label>
                                        <Input type="file" name="file" id="file" onChange={handleFileChange} />
                                    </div>
                                    <Button color="info" onClick={handleUpload}>Upload</Button>{' '}
                                    {img.downloadURL ?
                                        <img
                                            className="ref"
                                            src={img.downloadURL || "https://via.placeholder.com/80x80"}
                                            alt="Uploaded Images"
                                            height="80"
                                            width="80"
                                            objectfit="cover"
                                        />
                                        :
                                        <img
                                            className="ref"
                                            src={product.URLPicture}
                                            alt="Uploaded Images"
                                            height="80"
                                            width="80"
                                            objectfit="cover"
                                        />
                                    }

                                    <FormGroup>
                                        <Button type="submit" color='success'>
                                            Xác Nhận
                                        </Button>{' '}
                                        <Button color='danger' onClick={handleCancel}>
                                            Hủy
                                        </Button>{' '}
                                    </FormGroup>

                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;