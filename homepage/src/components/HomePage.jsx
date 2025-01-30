import { Button, Card, Image, Container, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import welcomeImage from '../assets/welcome-image.jpg'


function Homepage() {
    const navigate = useNavigate();

    function cardWithImage (imageStuff) {
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={imageStuff.link} />
                <Card.Body>
                    <Card.Title>{imageStuff.title}</Card.Title>
                    <Card.Text>{imageStuff.text}</Card.Text>
                </Card.Body>
            </Card>
        )
    }

    const fidgetSpinner = {
        link: '/fidget-spinner.jpg',
        title: 'Fidget Spinner',
        text: 'Fun to spin in your hand!'
    }

    const spinda = {
        link: '/spinda.jpg',
        title: 'Spinda',
        text: 'A weak Pokemon that pretty much no one likes.'
    }

    const spinner = {
        link: '/spinner.jpg',
        title: 'Spinner',
        text: 'A vehicle that can follow tracks up walls in The Legend of Zelda: Twilight Princess.'
    }

    const spinia = {
        link: '/spinias.jpg',
        title: 'Spinias',
        text: 'These losers from Paper Mario: The Thousand-Year Door spin around Rogueport sewers.'
    }

    return (
        <div className='bg-success text-white border border-light' style={{ minHeight: '100vh', width: '100%', padding: '20px' }}>
            <h1>Homepage</h1>
            <Image src={welcomeImage} alt="Spin the wheel" fluid />
            <br />
            <Container>
                <Row>
                    <Col>{cardWithImage(fidgetSpinner)}</Col>
                    <Col>{cardWithImage(spinda)}</Col>
                    <Col>{cardWithImage(spinner)}</Col>
                    <Col>{cardWithImage(spinia)}</Col>
                </Row>
            </Container>
            <Button variant='primary' size='lg' className="shadow rounded" onClick={() => navigate('/shop-now')}>
                Shop Now
            </Button>
        </div>
    )
}

export default Homepage;