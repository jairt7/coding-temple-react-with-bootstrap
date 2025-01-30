import { Component } from "react";
import axios from "axios";
import { func, number } from "prop-types";
import { Form, Button, Alert, Container, Modal } from "react-bootstrap";

class CustomerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            errors: {},
            isLoading: false,
            error: null,
            selectedCustomerId: null,
            showSuccessModal: false,
        };
    }

    componentDidMount() {
        const { id } = this.props.params;
        if (id) {
            this.fetchCustomerData(id);
        }
    }

    fetchCustomerData = (id) => {
        axios
            .get(`http://127.0.0.1:5000/customers/${id}`)
            .then((response) => {
                const customerData = response.data;
                this.setState({
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone,
                    username: customerData.username,
                    password: customerData.password,
                    selectedCustomerId: id,
                });
            })
            .catch((error) => {
                console.error("Error fetching customer data:", error);
            });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    validateForm = () => {
        const errors = {};
        const { name, email, phone, username, password } = this.state;

        if (!name.trim()) errors.name = "Name is required";
        if (!email.trim()) errors.email = "Email is required";
        if (!phone.trim()) errors.phone = "Phone is required";
        if (!username.trim()) errors.username = "Username is required";
        if (!password.trim()) errors.password = "Password is required";

        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        this.setState({ errors });

        if (Object.keys(errors).length === 0) {
            this.setState({ isLoading: true, error: null });

            const customerData = {
                name: this.state.name.trim(),
                email: this.state.email.trim(),
                phone: this.state.phone.trim(),
                username: this.state.username.trim(),
                password: this.state.password.trim(),
            };
            const apiUrl = this.state.selectedCustomerId
                ? `http://127.0.0.1:5000/customers/${this.state.selectedCustomerId}`
                : "http://127.0.0.1:5000/customers";

            const httpMethod = this.state.selectedCustomerId ? axios.put : axios.post;

            httpMethod(apiUrl, customerData)
                .then(() => {
                    this.setState({
                        name: "",
                        email: "",
                        phone: "",
                        username: "",
                        password: "",
                        errors: {},
                        selectedCustomerId: null,
                        isLoading: false,
                        showSuccessModal: true
                    });
                    
                })
                .catch((error) => {
                    this.setState({ error: error.toString(), isLoading: false });
                });
        } else {
            this.setState({ errors })
        }
    };

    closeModal = () => {
        this.setState({
            showSuccessModal: false,
            name: "",
            email: "",
            phone: "",
            username: "",
            password: "",
            errors: "",
            selectedCustomerId: null
        });
        this.props.navigate('/customers')
    }

    render() {
        const { name, email, phone, username, password, errors, error, isLoading, showSuccessModal } = this.state;

        return (
            <Container>
                {isLoading && <Alert variant="info">Submitting customer data...</Alert>}
                {error && <Alert variant="danger">Error submitting customer data: {error}</Alert>}
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGroupName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={name}
                            onChange={this.handleChange}
                            isInvalid={!!errors.name}
                        />
                        {errors.name && <div style={{color: 'danger'}}>{errors.name}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={this.handleChange}
                            isInvalid={!!errors.email}
                        />
                        {errors.email && <div style={{color: 'danger'}}>{errors.email}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={this.handleChange}
                            isInvalid={!!errors.phone}
                        />
                        {errors.phone && <div style={{color: 'danger'}}>{errors.phone}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={this.handleChange}
                        isInvalid={!!errors.username}
                    />
                    {errors.username && <div style={{color: 'danger'}}>{errors.username}</div>}
                    </Form.Group>

                    <Form.Group controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                        isInvalid={!!errors.password}
                    />
                    {errors.password && <div style={{color: 'danger'}}>{errors.password}</div>}
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {this.state.selectedCustomerId ? "Update Customer" : "Add Customer"}
                    </Button>
                </Form>

                <Modal show={showSuccessModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        The customer has been successfully {this.state.selectedCustomerId ? 'updated' : 'added'}.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        );
    }
}

CustomerForm.propTypes = {
    customerId: number,
    onUpdateCustomerList: func,
};

export default CustomerForm;
