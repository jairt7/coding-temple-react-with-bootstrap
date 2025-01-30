import { Component } from "react";
import CustomerList from "./components/CustomerList";
import OrderList from "./components/OrderList";
import ProductList from "./components/ProductList";
import CustomerFormWrapper from "./components/CustomerFormWrapper";
import ProductForm from "./components/ProductForm";
import NavigationBar from "./components/NavBar";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCustomerId: null,
      selectedOrderId: null
    };
  }

  handleCustomerSelect = (customerId) => {
    this.setState({ selectedCustomerId: customerId })
  }

  handleOrderSelect = (orderId) => {
    this.setState({ selectedOrderId: orderId })
  }

  render() {
    const { selectedCustomerId, selectedOrderId } = this.state

    return ( 
      <div className="appContainer">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-customer" element={<CustomerFormWrapper />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/products" element={<ProductList />} />
        </Routes>
      </div>
    );
  }
}

export default App;