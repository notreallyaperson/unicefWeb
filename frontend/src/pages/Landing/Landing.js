import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input } from 'reactstrap'
import InfiniteScroll from 'react-infinite-scroll-component';

import { getArticles, loadArticles } from '../../redux/actions/articleActions'
import { getRssFeeds } from '../../redux/actions/rssFeedsActions'

import './Landing.css'

//Import Components


function Landing() {
    const dispatch = useDispatch()
    const { articles } = useSelector(state => state.articleReducer)
    const { rssFeeds } = useSelector(state => state.rssFeedReducer)
    const [rssFeedTitles, setRssFeedTitles] = useState(null)
    const [page, setPage] = useState(0)

    useEffect(() => {
        dispatch(getArticles(0))
        dispatch(getRssFeeds())
    }, [])

    useEffect(() => {
        if (rssFeeds.length) {
            setRssFeedTitles(rssFeeds.map(({ _id, title }) => {
                return {
                    _id,
                    title,
                    checked: true
                }
            }))
        }
    }, [rssFeeds])

    const fetchData = e => {
        setPage(page + 1)
        dispatch(loadArticles(page))
    }

    const setFilter = (_id) => {
        setRssFeedTitles(rssFeedTitles.map(e => {
            if (e._id === _id) {
                e.checked = !e.checked
                return e
            } else {
                return e
            }
        }))
        dispatch(getArticles(0, rssFeedTitles.filter(e => e.checked).map(e => e._id)))
    }

    const selectAll = () => {
        setRssFeedTitles(rssFeedTitles.map(e => {
            e.checked = true
            return e
        }))
        dispatch(getArticles(0))
    }

    const deselectAll = () => {
        setRssFeedTitles(rssFeedTitles.map(e => {
            e.checked = false
            return e
        }))
        dispatch(getArticles(0), [])
    }

    return (
        <Fragment>
            <Row>
                <Col className='hide-in-small-screen' sm='3'>
                    <Card>
                        <CardHeader>Filters</CardHeader>
                        <CardBody>
                            <a href='#' onClick={() => selectAll()}>Select All</a>
                            <a href='#' onClick={() => deselectAll()} style={{ float: 'right' }}>Deselect All</a>
                            <br></br>
                            <br></br>
                            <Form>
                                {rssFeedTitles && rssFeedTitles.filter(e => e.title).map(e => <FormGroup key={e._id} check>
                                    <Label check>
                                        <Input type="checkbox"
                                            checked={e.checked}
                                            onChange={() => setFilter(e._id)}
                                        />{' '}
                                        {e.title}
                                    </Label>
                                </FormGroup>)}
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col xs="12" sm="9">
                    <InfiniteScroll
                        dataLength={articles.length}
                        next={fetchData}
                        hasMore={true}
                        loader={<h4>Loading...</h4>}
                        endMessage={
                            <p style={{ textAlign: 'center' }}>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                    >
                        {articles.map(e => <Col key={e._id} xs="12" sm="12">
                            <Card
                                style={{ marginBottom: '20px' }}
                            >
                                <CardHeader
                                    onClick={() => { window.open(e.url, '_blank') }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {e.title}
                                </CardHeader>
                                <CardBody>
                                    <p>Source: {rssFeedTitles && rssFeedTitles.find(({ _id }) => e.feedId === _id).title}</p>
                                    <p>Date: {e.date}</p>
                                    <p>Content Snippet: {e.content && e.content.length > 200 ? `${e.content.substring(0, 200)}...` : e.content}</p>
                                </CardBody>
                            </Card>
                        </Col>)}
                    </InfiniteScroll>
                </Col>
            </Row>
        </Fragment>
    );
}

export default Landing;