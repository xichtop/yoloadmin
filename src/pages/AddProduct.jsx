import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import categoryAPI from '../api/categoryAPI'
import { add, refresh } from '../slice/productSlice';

import { Button, FormGroup, Label, Input } from 'reactstrap';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

import firebase from '../firebase/firebase'

function AddProduct() {

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
        CategoryId: '',
        Title: '',
        Description: '',
        OldPrice: 1000,
        UnitPrice: 1000,
        Quantity: 1,
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
        if (img.downloadURL === null) {
            alert("Vui lòng chọn ảnh!");
        }
        else {
            const fetchGetProductId = async () => {
                var ProductId = '';
                try {
                    ProductId = await categoryAPI.getProductId(values.CategoryId);
                } catch (error) {
                    console.log("Failed to fetch user: ", error);
                }
                console.log(ProductId);
                if (Number(ProductId.slice(2)) + 1 < 10) {
                    var newId = values.CategoryId + "0" + (Number(ProductId.slice(2)) + 1);
                } else {
                    var newId = values.CategoryId + (Number(ProductId.slice(2)) + 1);
                }
                const product = {
                    ProductId: newId,
                    Description: values.Description,
                    CategoryId: values.CategoryId,
                    URLPicture: img.downloadURL,
                    UnitPrice: values.UnitPrice,
                    Title: values.Title,
                    OldPrice: values.OldPrice,
                    Quantity: values.Quantity,
                    colors: [],
                    sizes: [],
                }
                const action = add(product);
                dispatch(action);
                history.push('/productcolor');
            }
            fetchGetProductId();
        }
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
        CategoryId: Yup.string().required('Danh mục không được bỏ trống!.'),
        Title: Yup.string().required('Tiêu đề không được bỏ trống'),
        Description: Yup.string().required('Mô tả không được bỏ trống'),
        OldPrice: Yup.number().min(1, 'Giá phải lớn hơn 0').integer('Giá phải là số nguyên').required('Giá cũ không được bỏ trống'),
        UnitPrice: Yup.number().min(1, 'Giá phải lớn hơn 0').integer('Giá phải là số nguyên').required('Giá mới không được bỏ trống'),
        Quantity: Yup.number().min(1, 'Số lượng phải lớn hơn 0').integer('Số lượng là số nguyên').required('Số lượng không được bỏ trống'),
    });

    return (
        <div className="login">
            <div className="box">
                <div className="login-box" >
                    <h2>THÊM SẢN PHẨM MỚI</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {formikProps => {
                            // do something here ...
                            const { values, errors, touched } = formikProps;
                            console.log({ values, errors, touched });

                            return (
                                <Form>
                                    <FastField
                                        name="CategoryId"
                                        component={SelectField}

                                        label="Danh mục"
                                        placeholder="Chọn danh mục sản phẩm ..."
                                        options={CATEGORY_OPTIONS}
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
                                        name="OldPrice"
                                        component={InputField}

                                        label="Giá cũ"
                                        placeholder="Nhập giá cũ sản phẩm ..."
                                        type="number"
                                    />
                                    <FastField
                                        name="UnitPrice"
                                        component={InputField}

                                        label="Giá mới"
                                        placeholder="Nhập giá mới của sản phẩm ..."
                                        type="number"
                                    />
                                    <FastField
                                        name="Quantity"
                                        component={InputField}

                                        label="Số lượng"
                                        placeholder="Nhập số lượng sản phẩm ..."
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
                                    <img
                                        className="ref"
                                        src={img.downloadURL || "https://via.placeholder.com/80x80"}
                                        alt="Uploaded Images"
                                        height="80"
                                        width="80"
                                        objectfit="cover"
                                    />

                                    <FormGroup>
                                        <Button type="submit" color='success'>
                                            Tiếp theo
                                        </Button>{' '}
                                        <Button color='danger' onClick = {handleCancel}>
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

export default AddProduct;