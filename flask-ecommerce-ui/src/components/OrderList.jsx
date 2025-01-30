import { func, number } from 'prop-types';
import { useState, useEffect } from 'react';
import OrderDetails from './OrderDetails';
import axios from 'axios';

const OrderList = ({ customerId, onOrderSelect }) => {
    const [orders, setOrders] = useState([]);
    const [orderId, setOrderId] = useState();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/orders?customer_id=${customerId}`);
                setOrders(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching orders:', error)
            }
        }
        if (customerId) {
            fetchOrders()
        }
    }, [customerId]);

    return (
        <div className='order-list'>
            <h3>Orders</h3>
            <ul>
                {orders.map(order => (
                    <li key={order.id} onClick={() => setOrderId(order)}>
                        Order ID: {order.id}, Customer ID: {order.customer_id}
                        {orderId && order.id == orderId.id && <OrderDetails order = {order}/>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

OrderList.propTypes = {
    customerId: number,
    onOrderSelect: func
}

export default OrderList;