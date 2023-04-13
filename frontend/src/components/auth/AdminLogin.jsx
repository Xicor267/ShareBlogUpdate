import React, { useEffect, useState } from 'react';
import { BsAt } from 'react-icons/bs';
import { FaLock, FaFacebook, FaGoogle } from 'react-icons/fa';
import Navbar from '../home/Navbar';
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { admin_login } from "../../store/actions/authAction";

const AdminLogin = ({history}) => {
    // Truyen
    const dispatch = useDispatch()

    // useSelector get du lieu state.adminLogin
    const { loader, errorMessage, successMessage, authenticate } = useSelector(state => state.adminReducer)

    const [state, setState] = useState({
        email: '',
        password: ''
    })

    // get du lieu state
    const inputHendle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    //event cho Submit login => get du lieu 
    const AdminLogin = (e) => {
        e.preventDefault()
        dispatch(admin_login(state))
    }

    //Solve cac side effect thong bao success login admin => dashboard 
    //Solve cac side effect thong bao success toast
    useEffect(() => {
        if(authenticate){
            history.push('/dashborad/all-article');
        }
        if(successMessage) {
            toast.success(successMessage)
            dispatch({type : "LOGIN_SUCCES_MESSAGE_CLEAR"})
        }
        
    }, [dispatch, successMessage])

    //Solve cac side effect thong bao error toast
    useEffect(() => {
        if (errorMessage.error) {
            toast.error(errorMessage.error);
        }
        dispatch({type : "LOGIN_ERROR_CLEAR"})
    }, [errorMessage.error])

    return (
        <>
        <Navbar/>
        <div className="admin_login">
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

            <div className="card">
                <div className="auth">
                    <h3>---- Admin login ----</h3>
                    <form onSubmit={AdminLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="icon-input">
                                <div className="icon"><BsAt /></div>
                                <input onChange={inputHendle} value={state.email}
                                type="email" name='email' id='email'
                                placeholder='email' className="form-control" />
                            </div>
                            <p>{errorMessage?.email}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="icon-input">
                                <div className="icon"><FaLock /></div>
                                <input onChange={inputHendle} value={state.password}
                                type="password" name='password' id='password' 
                                placeholder='password' className="form-control" />
                            </div>
                            <p>{errorMessage?.password}</p>
                        </div>
                        <div className="form-group">
                            {
                                loader ? <button className="btn btn-block">
                                    <div className="spinner">
                                        <div className="spinner1"></div>
                                        <div className="spinner2"></div>
                                        <div className="spinner3"></div>
                                    </div>
                                </button> : <button className="btn btn-block">
                                    Login
                                </button>
                            }
                        </div>
                    </form>
                </div>
                <div className="image-logo">
                    <img src="https://images.pexels.com/photos/2033997/pexels-photo-2033997.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" />
                </div>
            </div>
        </div>
        </>
    )
}

export default AdminLogin