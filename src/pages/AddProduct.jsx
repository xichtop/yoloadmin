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
        CollectionId: '',
        FormId: '',
        Title: '',
        Material: '',
        Style: '',
        Description: '',
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
                if (Number(ProductId.slice(values.CategoryId.length)) + 1 < 10) {
                    var newId = values.CategoryId + "0" + (Number(ProductId.slice(2)) + 1);
                } else {
                    var newId = values.CategoryId + (Number(ProductId.slice(values.CategoryId.length)) + 1);
                }
                const product = {
                    ProductId: newId,
                    Description: values.Description,
                    CategoryId: values.CategoryId,
                    CollectionId: values.CollectionId,
                    FormId: values.FormId,
                    URLPicture: img.downloadURL,
                    UnitPrice: values.UnitPrice,
                    Title: values.Title,
                    Material: values.Material,
                    Style: values.Style,
                    OldPrice: values.UnitPrice - 40000,
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
    const COLLECTION_OPTIONS = [{
        value: 'MX2021',
        label: "Mùa xuân"
    },
    {
        value: 'MD2021',
        label: "Mùa đông"
    },
    {
        value: 'MT2021',
        label: "Mùa thu"
    },
    {
        value: 'MH2021',
        label: "Mùa hè"
    }];
    const FORM_OPTIONS = [
        {
            value: 'Oversize',
            label: "Quá cỡ"
        },
        {
            value: 'Regular',
            label: "Thường"
        },
        {
            value: 'Fitted',
            label: "Vừa vặn"
        },
        {
            value: 'ExtraSlim',
            label: "Thon gọn"
        },
    ];

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
        CollectionId: Yup.string().required('Bộ sưu tập không được bỏ trống!.'),
        FormId: Yup.string().required('Kiểu dáng không được bỏ trống!.'),
        Title: Yup.string().required('Tiêu đề không được bỏ trống'),
        Material: Yup.string().required('Tiêu đề không được bỏ trống'),
        Style: Yup.string().required('Tiêu đề không được bỏ trống'),
        Description: Yup.string().required('Mô tả không được bỏ trống'),
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

                            return (
                                <Form>
                                    <FastField
                                        name="CategoryId"
                                        component={SelectField}

                                        label="Danh mục - Bộ sưu tập - Kiểu dáng"
                                        placeholder="Chọn danh mục sản phẩm ..."
                                        options={CATEGORY_OPTIONS}
                                    />
                                    <FastField
                                        name="CollectionId"
                                        component={SelectField}

                                        // label="Danh mục"
                                        placeholder="Chọn bộ sưu tập của sản phẩm ..."
                                        options={COLLECTION_OPTIONS}
                                    />
                                    <FastField
                                        name="FormId"
                                        component={SelectField}

                                        // label="Danh mục"
                                        placeholder="Chọn kiểu dáng sản phẩm ..."
                                        options={FORM_OPTIONS}
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
                                        src={img.downloadURL || "https://via.placeholder.com/60x60"}
                                        alt="Uploaded Images"
                                        height="60"
                                        width="60"
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