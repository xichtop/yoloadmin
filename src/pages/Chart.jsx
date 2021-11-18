import React from 'react';

import LineChartCustom from '../components/Chart/LineChart';
import PieChartCustom from '../components/Chart/PieChart';
import BarChartCustom from '../components/Chart/BarChart';
import PieChartTwo from '../components/Chart/PieChartTwo';

import { Container, Row, Col, Label } from 'reactstrap';

const Chart = () => {

    const data = [{ name: 'Group A', value: 400, quantity: 20 },
    { name: 'Group B', value: 300, quantity: 20 },
    { name: 'Group C', value: 300, quantity: 30 },
    { name: 'Group D', value: 200, quantity: 50 },
    { name: 'Group E', value: 200, quantity: 50 },
    { name: 'Group F', value: 200, quantity: 50 },
    ];

    return (
        <Container className="chart">
            <Row className="chart__row">
                <Col xs="6" className="chart__row__col">
                    <Label>Thống Kê Doanh Thu Theo Năm</Label>
                    <LineChartCustom />
                </Col>
                <Col xs="6" className="chart__row__col">
                    <Label>Thống Kê Số Lượng Theo Danh Mục Theo Năm</Label>
                    <PieChartCustom />
                </Col>
            </Row>
            <Row className="chart__row">
                <Col xs="6" className="chart__row__col">
                    <Label>Thống Kê Doanh Thu Theo Tháng / Năm</Label>
                    <BarChartCustom />
                </Col>
                <Col xs="6" className="chart__row__col">
                    <Label>Thống Kê Số Lượng Theo Danh Mục Theo Tháng / Năm</Label>
                    <PieChartTwo />
                </Col>
            </Row>
        </Container>
    )
}

export default Chart
