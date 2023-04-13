import { Link } from "react-router-dom";
import React from "react";

const Ad = () => {
    return (
        <>
        <div className="title-show-article"> 
            <a><Link className='btn' to="/admin/login">Admin</Link></a>
        </div>
        </>
    )
}

export default Ad