import { Link } from "react-router-dom";
import { Container, Row, Col, Image, Button, NavLink } from "react-bootstrap";

function NotFound() {
    return (
        <div className="bg-success text-white vh-100">
            <h2>404 - Not Found</h2>
            <Container>
                <Row>
                    <Col>
            <Image src='/spinning-out-of-control.jpg' alt="When your life is spinning out of control" width="800" height="450" fluid />
            </Col>
            </Row>
            <br />
            <Row>
            <Col>
            <p>The page you're looking for doesn't exist.</p>
            </Col>
            <Col>
            <Button href="/" variant="outline-dark" onClick="/" as={NavLink}>Click here to go back to the homepage.</Button>
            </Col>
            </Row>
            </Container>
        </div>
    )
}

export default NotFound;