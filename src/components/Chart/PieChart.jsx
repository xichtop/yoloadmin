import React, { useState, useEffect } from 'react';
import categoryAPI from '../../api/categoryAPI';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';

import Datetime from "react-datetime";
import 'react-datetime/css/react-datetime.css';
import { useSelector } from 'react-redux';

const renderActiveShape = (props) => {

    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.Category}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Số Lượng ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

const COLORS = ['#00C49F', '#FFBB28', '#FF8042','#FF0000', '#A73489', '#865439'];

const PieChartCustom = (props) => {

    const token = useSelector(state => state.employee.token);

    const [year, setYear] = useState('')

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            var orders = [];
            try {
                orders = await categoryAPI.getStatisticByYear(2021, token);
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
                orders = await categoryAPI.getStatisticByYear(year, token);
            } catch (error) {
                console.log("Failed to fetch options: ", error);
            }
            setData(orders);
        }
        fetchOrders();
    }, [year])

    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <div className="chart__row__col__item">
            <div className="chart__row__col__item__picker">
                <span>Vui lòng chọn năm: </span>
                <Datetime dateFormat="YYYY" timeFormat="" onChange={(date) => setYear(date.year())} initialValue={'2021'} />
            </div>
                <ResponsiveContainer width="100%" height="75%">
                    <PieChart width={400} height={400}>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="Quantity"
                            onMouseEnter={onPieEnter}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
        </div>
    );
}

export default PieChartCustom;