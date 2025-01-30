import { useParams, useNavigate } from 'react-router-dom';
import CustomerForm from './CustomerForm';

const CustomerFormWrapper = (props) => {
    const params = useParams();
    const navigate = useNavigate();

    return <CustomerForm {...props} params={params} navigate={navigate} />;
};

export default CustomerFormWrapper;
