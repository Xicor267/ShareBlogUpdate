import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaFacebookSquare, FaTwitterSquare, FaYoutube, FaGithubSquare } from "react-icons/fa";
import { ImLinkedin } from "react-icons/im";
import { BsListUl } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment'
import UserInfo from './UserInfo';
import Log from './Log';
import Sig from './Sig';
import Ad from './Ad';

//nav = scrollTop
const Navbar = ({nav}) => {

    const dispatch = useDispatch()

    const { userInfo } = useSelector(state => state.adminReducer)

    const [profileModelShow, setProfileModelShow] = useState(false)

    const [nModelShow, setNModelShow] = useState(false)

    const profileModel = () => {
        if (profileModelShow) {
            setProfileModelShow(false)
        } else {
            setNModelShow(false)
            setProfileModelShow(true)
        }
    }

    return (
        <>
        <div ref={nav}  id='navbar' className="navbar">
            <div className="container">
                <div className="row">
                    <input type="checkbox" id='toggle' />
                    <div className="col-4">
                        <div className="image-menubar">
                            <Link className='image' to='/'>
                                <img src="http://localhost:3000/designImage/shareblog.jpg" alt="" />
                            </Link>
                            <label className='menu_icon' htmlFor="toggle"><BsListUl /></label>
                        </div>
                    </div>
                    <div className="col-8">
                        <ul className="link-list toggle">
                            <li className="link-item">
                                <Link to='/about'>About</Link>
                            </li>
                            <li className="link-item">
                                <Link to='/contact'>Contact</Link>
                            </li>
                            <li className="link-item">
                                <Link to='/policy'>Policy</Link>
                            </li>
                            <div className="social-icon">
                                <li className="link-item">
                                    <a href='https://www.facebook.com/trangnguyer/'><span><FaFacebookSquare /></span></a>
                                </li>
                                <li className="link-item">
                                    <a href='https://twitter.com/?lang=vi'><span><FaTwitterSquare /></span></a>
                                </li>
                                <li className="link-item">
                                    <a href='https://www.youtube.com/channel/UC7sH7UkomGQONKgcmtGCc8w'><span><FaYoutube /></span></a>
                                </li>
                                <li className="link-item">
                                    <a href='https://github.com/Xicor267/'><span><FaGithubSquare /></span></a>
                                </li>
                                <li className="link-item">
                                    <a href='https://www.linkedin.com/in/nguyen-nam-4743b6229/'><span><ImLinkedin /></span></a>
                                </li>
                                <Log/>
                                <Sig/>
                                {/* <Ad/> */}
                            </div>
                        </ul>
                        <label onClick={profileModel} htmlFor="adminInfo"><img 
                        style={{
                            position: 'fixed',
                            top: '10px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            right: '30px',
                            //boxShadow: '0 0 0 0 rgba(90, 113, 208, 0.11), 0 4px 16px 0 rgba(167, 175, 183, 0.83)'
                        }} src={userInfo.image} alt="" /></label>

                        <div className="name-time"
                        style={{
                            position: 'fixed',
                            bottom: '92%',
                            right: '10px',
                        }}>
                            <h3 style={{fontSize: '16px',}}>{userInfo.name}</h3>

                            {/* Format time (ll) => (Apr 8, 2023) */}
                            {/* <span style={{fontSize: '14px'}}>{moment(userInfo.createdAt).format('ll')}</span> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <UserInfo profileModelShow={profileModelShow} userInfo={userInfo}/>
        </>
    )
};

export default Navbar;