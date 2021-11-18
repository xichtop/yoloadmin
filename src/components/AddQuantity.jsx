import React from 'react';
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import productAPI from '../api/productAPI'

import { Button, FormGroup } from 'reactstrap';
import InputField from './InputField';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

function AddQuantity(props) {

    const productId = props.match.params.slug; 

    const token = useSelector(state => state.employee.token);

    const history = useHistory();

    const initialValues = {
        quantity: 1,
    }

    const handleSubmit = (values) => {
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
        const product = {
            productId: productId,
            quantity: values.quantity,
        }
        const fetchLogin = async () => {
            var result = {};
            try {
                result = await productAPI.updateQuantity(product, token);
            } catch (error) {
                console.log("Failed to fetch user: ", error);
            }
            console.log(result);
            if (result.successful === false) {
                store.addNotification({
                    title: "Nhập hàng thất bại!",
                    message: `Vui lòng thử lại sau!`,
                    type: "danger",
                    ...configNotify
                });
            } else {
                store.addNotification({
                    title: "Wonderful!!!",
                    message: `Nhập hàng thành công!`,
                    type: "success",
                    ...configNotify
                });

                history.push('/product');
            }
        }
        fetchLogin();
    }

    const handleCancel = () => {
        history.push('/product');
    }


    const validationSchema = Yup.object().shape({
        quantity: Yup.number().min(1, 'Số lượng phải lớn hơn 0').integer('Số lượng phải là số nguyên').required('Số lượng không được bỏ trống'),
    });

    return (
        <div className="login">
            <div className="box">
                <div className="login-box" >
                    <h2>NHẬP HÀNG</h2>
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
                                        name="quantity"
                                        component={InputField}

                                        label="Số lượng"
                                        placeholder="Nhập số lượng sản phẩm ..."
                                        type="number"
                                    />

                                    <FormGroup>
                                        <Button type="submit" color='success'>
                                            Xác Nhận
                                        </Button>
                                        <Button onClick = {handleCancel} color='danger'>
                                            Hủy
                                        </Button>
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

export default AddQuantity;