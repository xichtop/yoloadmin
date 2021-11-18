import React from 'react'
import { Route, Switch } from 'react-router-dom'

const Chart = React.lazy(() => import('../pages/Chart'));
const Product = React.lazy(() => import('../pages/Product'));
const Order = React.lazy(() => import('../pages/Order'));
const User = React.lazy(() => import('../pages/User'));
const Discount = React.lazy(() => import('../pages/Discount'));
const AddProduct = React.lazy(() => import('../pages/AddProduct'));
const EditProduct = React.lazy(() => import('../components/EditProduct'));
const EditColor = React.lazy(() => import('../components/ColorEdit'));
const EditSize = React.lazy(() => import('../components/SizeEdit'));
const EditDiscount = React.lazy(() => import('../components/EditDiscount'));
const AddDiscount = React.lazy(() => import('../components/AddDiscount'));
const AddQuantity = React.lazy(() => import('../components/AddQuantity'));
const Detail = React.lazy(() => import('../components/Detail'));
const ColorRegister = React.lazy(() => import('../components/ColorRegister'));
const SizeRegister = React.lazy(() => import('../components/SizeRegister'));
const ConfirmProduct = React.lazy(() => import('../components/ConfirmProduct'));
const NotFound = React.lazy(() => import('../components/NotFound/index'));

const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={Chart}/>
            <Route path='/product' component={Product}/>
            <Route path='/order' component={Order}/>
            <Route path='/user' component={User}/>
            <Route path='/discount/additem' component={AddDiscount}/>
            <Route path='/discount/edit/:discountId/:percentDiscount/:quantity' component={EditDiscount}/>
            <Route path='/discount' component={Discount}/>
            <Route path='/addproduct' component={AddProduct}/>
            <Route path='/editproduct' component={EditProduct}/>
            <Route path='/editcolor' component={EditColor}/>
            <Route path='/editsize' component={EditSize}/>
            <Route path='/updateQuantity/:slug' component={AddQuantity}/>
            <Route path='/productcolor' component={ColorRegister}/>
            <Route path='/productsize' component={SizeRegister}/>
            <Route path='/productconfirm' component={ConfirmProduct}/>
            <Route path='/detail/:slug' component={Detail}/>
            <Route component={NotFound} />
        </Switch>
    )
}

export default Routes
