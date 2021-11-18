import React from 'react';
import { useHistory } from "react-router-dom";
import discountAPI from '../api/discountAPI'
import { useSelector } from 'react-redux';
import { Button, FormGroup } from 'reactstrap';
import InputField from './InputField';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

function AddDiscount(props) {

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
        DiscountId: props.match.params.discountId,
        PercentDiscount: props.match.params.percentDiscount,
        Quantity: props.match.params.quantity,
    }

    const handleSubmit = (values) => {
        const fetchAddDiscount = async () => {
            const newDiscount = {
                DiscountId: props.match.params.discountId,
                PercentDiscount: values.PercentDiscount,
                Quantity: values.Quantity,
            }
            var result = {};
            try {
                result = await discountAPI.update(newDiscount, token);
            } catch (error) {
                console.log("Failed to fetch discount: ", error);
            }
            console.log(result);
            if (result.successful === false) {
                store.addNotification({
                    title: "Sửa mã giảm giá thất bại!",
                    message: `Vui lòng thử lại sau!`,
                    type: "danger",
                    ...configNotify
                });
                history.push('/discount');
            } else {
                store.addNotification({
                    title: "Wonderful!!!",
                    message: `Sửa mã giảm giá thành công!`,
                    type: "success",
                    ...configNotify
                });

                history.push('/discount');
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
                                        disable="true"
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