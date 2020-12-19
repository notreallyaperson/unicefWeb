import React from 'react';
import { Col, Card, CardTitle, CardBody } from 'reactstrap';

const TotalCard = ({ titleEN, count, color, backgroundColor }) => {
    return (
        <Col
            xs='auto'
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '2rem',
            }}>
            <Card style={{ width: '170px' }}>
                <CardBody style={{ backgroundColor }}>
                    <center>
                        <CardTitle>
                            {' '}
                            <h5>
                                {titleEN}
                            </h5>
                        </CardTitle>
                        <h5 style={{ color, fontSize: '35px', fontWeight: 'bold' }}>{count}</h5>
                    </center>
                </CardBody>
            </Card>
        </Col>
    );
};

export default TotalCard