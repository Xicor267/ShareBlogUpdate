import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminLogin from "./components/auth/AdminLogin";
import Login from "./components/auth/Login";
import ProtectRoute from "./components/auth/ProtectRoute";
import Register from "./components/auth/Register";
import Dashborad from "./components/dashborad/Dashborad";
import Home from './components/home/Home';
import EmailVerify from './components/auth/EmailVerify'

import { userView } from './store/actions/home/homeAction'
import { useEffect } from "react";
import { useDispatch } from 'react-redux'

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userView())
  }, [])

  return (
    <Router>
      <Switch>
        {/* Client */}
        <Route path='/' component={Home} exact/>
        <Route path='/admin/login' component={AdminLogin} exact />
        <Route path='/register' component={Register} exact />
        <Route path='/register/email-verify' component={EmailVerify} exact />
        <Route path='/login' component={Login} exact />
        <Route path='/artical/:currentPage?' component={Home} exact />
        <Route path='/artical/details/:slug' component={Home} exact />
        <Route path='/artical/category/:categorySlug/:currentPage?' component={Home} exact />
        <Route path='/artical/tag/:tagSlug/:currentPage?' component={Home} exact />
        <Route path='/artical/search/:searchValue' component={Home} exact />

        {/*Protech Dashboard */}
        <ProtectRoute path="/dashborad" component={Dashborad} exact />
        
        {/* Articals */}
        <Route path="/dashborad/all-article/:currentPage?" component={Dashborad} exact />
        <Route path="/dashborad/article-add" component={Dashborad} exact />
        <Route path="/dashborad/article/edit/:articleSlug" component={Dashborad} exact />

        {/* Category */}
        <Route path="/dashborad/all-category/:currentPage?" component={Dashborad} exact />
        <Route path="/dashborad/add-category" component={Dashborad} exact />
        <Route path="/dashborad/category/edit/:cateSlug" component={Dashborad} exact />

        {/* Tag */}
        <Route path="/dashborad/all-tag/:currentPage?" component={Dashborad} exact />
        <Route path="/dashborad/add-tag" component={Dashborad} exact />
        <Route path="/dashborad/tag/edit/:tagSlug" component={Dashborad} exact />

        {/* All sub admin */}
        <Route path="/dashborad/all-sub-admin/:currentPage?" component={Dashborad} exact />

        {/* All user */}
        <Route path="/dashborad/all-user/:currentPage?" component={Dashborad} exact />

        {/* Profile sub admin */}
        <Route path="/dashborad/sub-admin-profile/:adminId" component={Dashborad} exact />

        {/* Comment */}
        <Route path="/dashborad/comments/:currentPage?" component={Dashborad} exact />
        
      </Switch>
    </Router>
  );
}

export default App;
