import React from 'react'
import { Route, Switch } from 'react-router-dom'

const Chart = React.lazy(() => import('../pages/Chart'));
const Product = React.lazy(() => import('../pages/Product'));
const Order = React.lazy(() => import('../pages/Order'));
const User = React.lazy(() => import('../pages/User'));
const AddProduct = React.lazy(() => import('../pages/AddProduct'));
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
            <Route path='/addproduct' component={AddProduct}/>
            <Route path='/productcolor' component={ColorRegister}/>
            <Route path='/productsize' component={SizeRegister}/>
            <Route path='/productconfirm' component={ConfirmProduct}/>
            <Route path='/detail/:slug' component={Detail}/>
            <Route component={NotFound} />
        </Switch>
    )
}

export default Routes
