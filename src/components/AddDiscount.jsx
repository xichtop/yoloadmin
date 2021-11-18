import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import discountAPI from '../api/discountAPI'
import { useSelector } from 'react-redux';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import InputField from '../components/InputField';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

function AddDiscount() {

    const history = useHistory();

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

    const initialValues = {
        DiscountId: '',
        PercentDiscount: 5,
        Quantity: 1,
    }

    const handleSubmit = (values) => {
        const fetchAddDiscount = async () => {
            var Discount = null;
            try {
                Discount = await discountAPI.get(values.DiscountId, token);
            } catch (error) {
                console.log("Failed to fetch discount: ", error);
            }
            console.log(Discount);
            if (Discount.length !== 0) {
                store.addNotification({
                    title: "Error!",
                    message: `Mã giảm giá đã tồn tại!`,
                    type: "warning",
                    ...configNotify
                });
            } else {
                const newDiscount = {
                    DiscountId: values.DiscountId,
                    PercentDiscount: values.PercentDiscount,
                    Quantity: values.Quantity,
                }
                var result = {};
                try {
                    result = await discountAPI.addItem(newDiscount, token);
                } catch (error) {
                    console.log("Failed to fetch discount: ", error);
                }
                console.log(result);
                if (result.successful === false) {
                    store.addNotification({
                        title: "Thêm mã giảm giá thất bại!",
                        message: `Vui lòng thử lại sau!`,
                        type: "danger",
                        ...configNotify
                    });
                    history.push('/discount');
                } else {
                    store.addNotification({
                        title: "Wonderful!!!",
                        message: `Thêm mã giảm giá thành công!`,
                        type: "success",
                        ...configNotify
                    });

                    history.push('/discount');
                }
            }
        }
        fetchAddDiscount();
    }

    const handleCancel = () => {
        history.push('/discount');
    }

    const validationSchema = Yup.object().shape({
        DiscountId: Yup.string().required('Mã giảm giá không được bỏ trống!.'),
        PercentDiscount: Yup.number().min(1, 'Phần trăm giảm giá phải lớn hơn 0').integer('Phần trăm giảm giá phải là số nguyên').required('Phần trăm giảm giá không được bỏ trống'),
        Quantity: Yup.number().min(1, 'Số lượng phải lớn hơn 0').integer('Số lượng là số nguyên').required('Số lượng không được bỏ trống'),
    });

    return (
        <div className="login">
            <div className="box">
                <div className="login-box" >
                    <h2>THÊM MÃ GIẢM GIÁ MỚI</h2>
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
                                        name="DiscountId"
                                        component={InputField}

                                        label="Mã giảm giá"
                                        placeholder="Nhập mã giảm giá ..."
                                        type="text"
                                    />
                                    <FastField
                                        name="PercentDiscount"
                                        component={InputField}

                                        label="Phần trăm giảm giá"
                                        placeholder="Nhập phần trăm giảm giá ..."
                                        type="number"
                                    />
                                    <FastField
                                        name="Quantity"
                                        component={InputField}

                                        label="Số lượng"
                                        placeholder="Nhập số lượng mã giảm giá ..."
                                        type="number"
                                    />

                                    <FormGroup>
                                        <Button type="submit" color='success'>
                                            Xác nhận
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

export default AddDiscount;