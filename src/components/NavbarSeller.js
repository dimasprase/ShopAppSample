import React from 'react';
import { Link } from 'react-router-dom'
 const Navbar = ()=>{
    return(
            <nav className="nav-wrapper">
                <div className="container">
                    <Link to="/buyer" className="brand-logo">Belanja  Belanji</Link>
                    
                    <ul className="right">
                        
                    </ul>
                </div>
            </nav>     
    )
}

export default Navbar;