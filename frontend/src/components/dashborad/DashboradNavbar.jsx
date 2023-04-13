import React, { useState } from 'react';
import { BsBell, BsListUl } from "react-icons/bs";
import { FaTrash } from 'react-icons/fa';
import moment from 'moment'
import { Link } from "react-router-dom";
import AdminInfo from './AdminInfo';
import UserMessage from './UserMessage';
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from 'react-redux';
import { get_notification, seen_notification, delete_notification } from '../../store/actions/Dashborad/dashboardAction';
import { useEffect } from 'react';

const DashboradNavbar = () => {

    const dispatch = useDispatch()

    const { userInfo } = useSelector(state => state.adminReducer)

    const { notifications, successMessage } = useSelector(state => state.dashboardIndex)

    const [profileModelShow, setProfileModelShow] = useState(false)

    const [nModelShow, setNModelShow] = useState(false)

    //Show profile
    const profileModel = () => {
        if (profileModelShow) {
            setProfileModelShow(false)
        } else {
            setNModelShow(false)
            setProfileModelShow(true)
        }
    }

    //Show notification
    const nModel = () => {
        if (nModelShow) {
            setNModelShow(false)
        } else {
            setProfileModelShow(false)
            setNModelShow(true)
        }
    }

    useEffect(() => {
        dispatch(get_notification(userInfo.id))
    }, [])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch({
                type: "N_SUCCESS_MESSAGE_CLEAR"
            })
            dispatch(get_notification(userInfo.id))
        }
    }, [successMessage])

    const seenNotification = (id) => {
        dispatch(seen_notification(id))
    }

    return (
            <>
            <div className="dashborad-navbar">
                <Toaster position={'bottom-center'}
                    reverseOrder={false}
                    toastOptions={
                        {
                            style: {
                                fontSize: '15px'
                            }
                        }
                    }
                />

                <div className="dashborad-navbar-left-side">
                    <label htmlFor="" className='dash'><span>S</span></label>
                    <label className='bar' htmlFor="sidebar"><span><BsListUl /></span></label>
                    <h2><Link to='/dashborad'>ShareBlog</Link></h2>
                </div>
                {/* Right */}
                <div className="dashborad-navbar-right-side">
                    <h2><Link to='/dashborad'><span>View site</span></Link></h2>
                    <div className="search">
                        <input type="text" placeholder='search' className="form-control" />
                    </div>
                    <div className="user">
                        <div className="natification-message">
                            <div className="natification">
                                <div onClick={nModel}>
                                    <span><BsBell/></span>
                                    {
                                        notifications.length > 0 && <div className="nCount">{notifications.length}</div>
                                    }
                                </div>
                                <div className={`natifications ${nModelShow ? 'show' : ''}`}>
                                    <ul>
                                        {
                                            notifications.map((n, index) => <li className={n.status === 'seen' ? '' : 'bg'} key={index}>
                                                <Link onClick={() => seenNotification(n._id)} to={`/artical/details/${n.slug}`}>{n.subject}</Link>
                                                <div onClick={() => dispatch(delete_notification(n._id))} className="nDelete"><FaTrash /></div>
                                            </li>)
                                        }
                                    </ul>
                                </div>
                            </div>
                            <UserMessage />
                        </div>
                        <label onClick={profileModel} htmlFor="adminInfo"><img src={userInfo.image} alt="" /></label>
                        <div className="name-time">
                            <h3 style={{fontWeight: 'bold'}}>{userInfo.name}</h3>

                            {/* Format time (ll) => (Apr 8, 2023) */}
                            <span>{moment(userInfo.createdAt).format('ll')}</span>
                        </div>
                    </div>
                </div>
            </div>
            <AdminInfo profileModelShow={profileModelShow} userInfo={userInfo} />
            </>
    )   
}

export default DashboradNavbar