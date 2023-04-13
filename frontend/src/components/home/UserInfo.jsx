import React from 'react'
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux'
import {logout_user} from '../../store/actions/authAction'


const UserInfo = ({ profileModelShow, userInfo }) => {

  const dispatch = useDispatch()

  const history = useHistory()

  const logout = () => {
    dispatch(logout_user({ role: userInfo.role, history }))
  }

  return (
    <div  className={`adminInfo ${profileModelShow ? 'show' : ''}`}>
      <div className="image-email">
        <img src={userInfo.image} alt="" />
        <span>{userInfo.email}</span>
      </div>
      <ul>
        {
           userInfo && userInfo.role === 'admin' || userInfo.role === 'sub admin' || userInfo.role !== 'user' ?
           <li><Link to='/dashborad/sub-admin-profile/323'>Profile</Link></li>
           : null
        }
        {/* <li><Link to='/dashborad/sub-admin-profile/323'>Profile</Link></li> */}
        {/* <li><Link to='/'>View site</Link></li> */}
        <li onClick={logout}><span>Logout</span></li>
      </ul>
    </div>
  )
}

export default UserInfo