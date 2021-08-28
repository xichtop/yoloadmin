import React, { useState, useEffect } from 'react';
import orderAPI from '../../api/orderAPI';
import PropTypes from 'prop-types';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import Datetime from "react-datetime";
import 'react-datetime/css/react-datetime.css';

const colors = scaleOrdinal(schemeCategory10).range();

const getPath = (x, y, width, height) => `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
          Z`;

const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

TriangleBar.propTypes = {
    fill: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
};

export default function BarChartCustom() {

    const [year, setYear] = useState(2021);

    const [month, setMonth] = useState(8);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            var orders = [];
            try {
                orders = await orderAPI.getStatisticByMonthAndYear(8,2021);
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
                orders = await orderAPI.getStatisticByMonthAndYear(month, year);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setData(orders);
        }
        fetchOrders();
    }, [month,year])

    return (
        <div className="chart__row__col__item">
            <div className="chart__row__col__item__picker">
                <span>Vui lòng chọn tháng / năm: </span>
                <Datetime dateFormat="YYYY-MM" initialValue={'2021-08'} timeFormat="" onChange={(date) => {
                    setYear(date.year());
                    setMonth(date.month());
                }} />
            </div>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Total" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

        </div>
    );
}