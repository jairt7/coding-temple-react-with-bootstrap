import { func, number } from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDetails = ({ order }) => {

    return (
        <div className='order'>
            <h3>Order details</h3>
            <p>Order ID: {order.id}</p>
            <p>Customer ID: {order.customer_id}</p>
            <p>Shipping date: {order.shipping_date}</p>
            <p>Arrival date: {order.arrival_date}</p>
            <p>Order status: {order.order_status}</p>
        </div>
    );
};

OrderDetails.propTypes = {
    orderId: number,
}

export default OrderDetails;