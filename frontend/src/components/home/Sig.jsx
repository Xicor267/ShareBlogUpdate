import { Link } from "react-router-dom";
import React from "react";
import { useSelector, useDispatch } from 'react-redux'

const Sig = () => {

    const { userInfo } = useSelector(state => state.adminReducer)

    return (
        <>
        {
            userInfo && userInfo.role === 'admin' || userInfo.role === 'sub admin' || userInfo.role === 'user' ?
            null
            : <div className="title-show-article"> 
                <a><Link className='btn' to="/register">Register</Link></a>
            </div>
        }
        {/* <div className="title-show-article"> 
            <a><Link className='btn' to="/login">Login</Link></a>
        </div> */}
        </>
    )
}

export default Sig