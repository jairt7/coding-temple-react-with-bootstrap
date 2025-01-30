import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div>
            <h2>404 - Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
            <p><Link to="/">Click here</Link> to go back to the homepage.</p>
        </div>
    )
}

export default NotFound;