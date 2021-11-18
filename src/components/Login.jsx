import { FastField, Form, Formik } from 'formik';
import React from 'react';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { Button, FormGroup } from 'reactstrap';
import * as Yup from 'yup';
import employeeAPI from '../api/employeeAPI';
import { login } from '../slice/employeeSlice';
import InputField from './InputField';


function Login() {

    const dispatch = useDispatch();

    const history = useHistory();

    const initialValues = {
        employeeId: '',
        password: '',
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
        const user = {
            email: values.employeeId,
            password: values.password,
        }
        const fetchLogin = async () => {
            var result = {};
            try {
                result = await employeeAPI.login(user);
            } catch (error) {
                console.log("Failed to fetch user: ", error);
            }
            console.log(result);
            if (result.successful === false) {
                store.addNotification({
                    title: "Đăng nhập thất bại!",
                    message: `Tài khoản hoặc mật khẩu không đúng! ${user.email} + ${user.password}`,
                    type: "danger",
                    ...configNotify
                });
            } else {
                store.addNotification({
                    title: "Đăng nhập thành công!",
                    message: `Xin chào ${values.employeeId}`,
                    type: "success",
                    ...configNotify
                });

                const user = result.employee;
                const token = result.accessToken;

                // const user = {
                //         EmployeeId: "NV001",
                //         FullName: "Lê Xích Tốp",
                //         Workphone: "0377025912",
                //         Password: "123456"
                // }
                // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbWFpbCI6Ik5WMDAxIiwiaWF0IjoxNjMyMTQxMTM0fQ.lAUBYnKbD4y36NSRb7dj-vI-q2lf8Hewl-JqLmVeyO0";
                const action = login({
                    user,
                    token
                })
                dispatch(action);
            }
        }
        fetchLogin();
    }


    const validationSchema = Yup.object().shape({
        employeeId: Yup.string().required('Mã nhân viên không được bỏ trống!.'),
        password: Yup.string().required('Mật khẩu không được bổ trống'),
    });

    return (
        <div className="login">
            <div className="box">
                <div className="login-box" >
                    <h2>ĐĂNG NHẬP</h2>
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
                                        name="employeeId"
                                        component={InputField}

                                        label="Mã nhân viên"
                                        placeholder="Nhập mã nhân viên của bạn ..."
                                    />

                                    <FastField
                                        name="password"
                                        component={InputField}

                                        label="Mật khẩu"
                                        placeholder="Nhập mật khẩu của bạn ..."
                                        type="password"
                                    />
                                    <FormGroup>
                                        <Button type="submit" color='success'>
                                            Đăng nhập
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

export default Login;