import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {
    Button, Container, Icon, Item, Label, Message, Segment, Accordion, Header, Pagination,
    Grid, Divider, Popup, Form, Card, Modal, Image, Rating
} from 'semantic-ui-react'
import { ProductListURL, addToCartURL, PriceListURL } from '../constants'
import { authAxios } from '../utils'
import { fetchCart } from '../store/actions/cart'


class ProductList extends React.Component {
    state = {
        loading: false,
        error: null,
        data: [], //note, value stored from response is res.data.results
        submittedItemsPerPage: 10,
        activePage: 1,
        totalPages: 1,
        defaultActivePage: 1,  //default activate page is #1
        itemsPerPage: 1,
        itemTotalCount: 1,

    }

    handleTotalPageCount = (totalProductsCount, itemsPerPage) => {
        //if item count divided by items per page has NO remainder
        if (totalProductsCount % itemsPerPage === 0) {

            const newPageCount = totalProductsCount / itemsPerPage
            this.setState({ totalPages: newPageCount })

        }
        //else, if item count divided by items per page has remainder, add 1
        else {
            const newPageCount = Math.floor(totalProductsCount / itemsPerPage) + 1
            this.setState({ totalPages: newPageCount })

        }
    }

    handlePaginationChange = (e, { activePage }) => {
        this.setState({ activePage })
        //this.handleFetchAuthorList(activePage)
    }


    componentDidMount() {
        const { defaultActivePage } = this.state
        this.handleFetchPriceList()
        //this.handleFetchAuthorList(defaultActivePage)
        this.hadleFetchItemsPerPage()
        this.hadleFetchItemTotalCount()
    }

    hadleFetchItemsPerPage = () => {
        this.setState({ loading: true })
        axios.get(ProductListURL(1))
            .then(res => {
                this.setState({ itemsPerPage: res.data.results.length, loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    hadleFetchItemTotalCount = () => {
        this.setState({ loading: true })
        axios.get(ProductListURL(1))
            .then(res => {
                this.setState({ itemTotalCount: res.data.count, loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    handleFetchPriceList = () => {
        const { match: { params } } = this.props
        this.setState({ loading: true })
        authAxios
            .get(PriceListURL(params.price))
            .then(res => {
                this.setState({ data: res.data.results, loading: false })
            })
            .catch(err => {
                this.setState({ error: err })
            })
    }


    handleFetchProductList = pageNumber => {
        this.setState({ loading: true })
        const { itemsPerPage } = this.state

        axios.get(ProductListURL(pageNumber))
            .then(res => {
                this.handleTotalPageCount(res.data.count, itemsPerPage)
                this.setState({ data: res.data.results, loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }

    handleAddToCart = slug => {
        this.setState({ loading: true })
        authAxios
            .post(addToCartURL, { slug })
            .then(res => {
                this.props.fetchCart()
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ error: err, loading: false })
            })
    }


    render() {
        const { data, error, loading, activePage,
            itemsPerPage, submittedItemsPerPage, totalPages, testData } = this.state


        return (
            <Container>
                {/*segment padding for better page visibility*/}
                <Segment style={{ padding: "1em 0em" }} vertical>
                    <Header as='h1'>
                        Books by Price
                    </Header>
                </Segment>


                {error && (
                    <Message
                        error
                        header='There were some errors with your submission'
                        content={JSON.stringify(error)}
                    />
                )}

                <Segment loading={loading}>
                    <Card.Group itemsPerRow={3}>
                        {data.map((item, i) => {
                            return (
                                <React.Fragment>
                                    <Card centered>

                                        <Image
                                            centered size='medium' src={item.image}
                                            onClick={() => this.props.history.push(`/products/${item.id}`)}
                                        />

                                        <Label attached='top right' color={item.label === 'Fiction' ? "blue" : "red"} >
                                            {item.label}
                                        </Label>
                                        <Card.Content>
                                            <Card.Header
                                                onClick={() => this.props.history.push(`/products/${item.id}`)}>
                                                {item.title}
                                            </Card.Header>
                                            <Card.Meta>
                                                <span className='cinema'>{item.genre}</span>
                                            </Card.Meta>
                                            <Card.Description>
                                                Written by {item.author_name}
                                            </Card.Description>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <a>
                                                <Rating icon='star' defaultRating={0} maxRating={10} />
                                                <br></br>Customer Reviews
                                            </a>
                                        </Card.Content>
                                        <Popup
                                            content='Item added!'
                                            on='click'
                                            hideOnScroll
                                            position='bottom center'
                                            trigger={
                                                <Button primary floated='right' icon labelPosition='right' onClick={() => this.handleAddToCart(item.slug)}>
                                                    {/* convert number from string to float, fix to 2 decimal places*/}
                                                    $ {Number.parseFloat(item.price).toFixed(2)}
                                                    <Icon name='plus cart' />
                                                </Button>}
                                        />
                                    </Card>
                                </React.Fragment>
                            )
                        })}
                    </Card.Group>
                </Segment>

                <Pagination
                    activePage={activePage}
                    onPageChange={this.handlePaginationChange}
                    totalPages={totalPages}
                />

                <Segment compact>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Input
                            label='Items per page'
                            name='submittedItemsPerPage'
                            onChange={this.handleChange}
                            value={submittedItemsPerPage}
                        />
                        <Form.Button content='Submit' />
                    </Form>
                </Segment>

            </Container>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCart: () => dispatch(fetchCart())
    }

}

export default connect(null, mapDispatchToProps)(ProductList)