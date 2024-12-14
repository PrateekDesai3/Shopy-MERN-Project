import React, { useContext, useState } from "react";
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import './Navbar.css';
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const Navbar =()=>{
    const [menu,setmenu]=useState("shop");
     const {getTotalCartItems}= useContext(ShopContext);
    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="" />
                <p>SHOPY</p>
            </div>
            <ul className="nav-menu">
                <li onClick={()=>{setmenu("shop")}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link>{menu==="shop"? <hr/>:<></>}</li>
                <li onClick={()=>{setmenu("mens")}}> <Link style={{textDecoration:'none'}}  to='/mens'>Men</Link>{menu==="mens"? <hr/>:<></>}</li>
                <li onClick={()=>{setmenu("womens")}}><Link style={{textDecoration:'none'}} to='/womens'>Women</Link>{menu==="womens"? <hr/>:<></>}</li>
                <li onClick={()=>{setmenu("kids")}}><Link style={{textDecoration:'none'}} to='/kids'>Kids</Link>{menu==="kids"? <hr/>:<></>}</li>
            </ul>
            <div className="nav-login-cart">
            {localStorage.getItem('auth-token') 
  ? (
      <button 
        onClick={() => {
          localStorage.removeItem('auth-token');
          window.location.replace('/');
        }}
      >
        Logout
      </button>
    )
  : (
      <Link to="/Login">
        <button>Login</button>
      </Link>
    )
}                
                <Link  to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>

        </div>
    )
}

export default Navbar;