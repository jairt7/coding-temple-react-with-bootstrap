import { Link, NavLink } from "react-router-dom";

function NavigationBar () {
    return (
        <nav className="navigationBar">
            <NavLink to="/" activeclassname="active">Home</NavLink>
            <NavLink to="/browse-characters" activeclassname="active">Browse Characters</NavLink>
            <NavLink to="/comics" activeclassname="active">Comics</NavLink>
        </nav>
    )
}

export default NavigationBar;