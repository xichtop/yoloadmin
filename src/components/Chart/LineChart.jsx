import React, { useState, useEffect } from 'react';
import orderAPI from '../../api/orderAPI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Datetime from "react-datetime";
import 'react-datetime/css/react-datetime.css';

const LineChartCustom = (props) => {

    const [year, setYear] = useState(2021);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            var orders = [];
            try {
                orders = await orderAPI.getStatisticByYear(2021);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setData(orders);
        }
        fetchOrders();
    }, [])

    useEffect(() => {
        const fetchOrders = async () => {
            var orders = [];
            try {
                orders = await orderAPI.getStatisticByYear(year);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setData(orders);
        }
        fetchOrders();
    }, [year])

    return (
        <div className="chart__row__col__item">
            <div className="chart__row__col__item__picker">
                <span>Vui lòng chọn năm: </span>
                <Datetime dateFormat="YYYY" timeFormat="" onChange={(date) => setYear(date.year())} initialValue={'2021'}/>
            </div>
            <ResponsiveContainer width="100%" height="80%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Month" />
                    <YAxis />
                    <Tooltip />
                    {/* <Legend /> */}
                    <Line type="monotone" dataKey="Total" stroke="#FF8042" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default LineChartCustom;