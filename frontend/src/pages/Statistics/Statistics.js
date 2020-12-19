import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardBody, Col, Row } from 'reactstrap';
import { getUsers } from '../../redux/actions/userActions'

import './Statistics.css'

//Import Components
import BarChart from './BarChart/BarChart'
import TotalCard from './TotalCard/TotalCard'

function Statistics() {
    const dispatch = useDispatch()
    const { users } = useSelector(state => state.userReducer)
    const [data, setData] = useState({})

    useEffect(() => {
        dispatch(getUsers())
    }, [])

    // Mapping User Data to create charts based on changed data
    useEffect(() => {
        if (users) {
            var object = {
                active: 0,
                pending: 0,
                suspended: 0,
                expired: 0,
            }
            users.forEach(user => {
                if (!object[user.status]) object[user.status] = 0
                object[user.status]++
            });
            setData(object)
        }
    }, [users])
    console.log(data)

    return (
        <Fragment>
            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TotalCard
                    titleEN='Active'
                    count={data['active']}
                    color='#000'
                    backgroundColor='rgba(255, 99, 132, 0.6)'
                />
                <TotalCard
                    titleEN='Pending'
                    count={data['pending']}
                    color='#000'
                    backgroundColor='rgba(54, 162, 235, 0.6)'
                />
                <TotalCard
                    titleEN='Suspended'
                    count={data['suspended']}
                    color='#000'
                    backgroundColor='#ecd1a8'
                />
                <TotalCard
                    titleEN='Expired'
                    count={data['expired']}
                    color='#000'
                    backgroundColor='#b5ead6'
                />
                <TotalCard
                    titleEN='Total'
                    count={users.length}
                    color='#000'
                    backgroundColor='rgba(153, 102, 255, 0.6)'
                />
            </Row>
            <br></br>
            <Row>
                <Col md='4' xs="12" sm="6">
                    <Card>
                        <CardBody>
                            <center>
                                <span>Members Break Down</span>
                                <br></br>
                                <br></br>
                                <BarChart data={data} />
                            </center>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment >
    );
}

export default Statistics;