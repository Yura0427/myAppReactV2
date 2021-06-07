import React from "react";
import Signup from "./components/authentication/Signup";
import { AuthProvider } from "./contexts/AuthContext";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Profile from "./components/authentication/Profile";
import Login from "./components/authentication/Login";
import PrivateRoute from "./components/authentication/PrivateRoute";
import ForgotPassword from "./components/authentication/ForgotPassword";
import UpdateProfile from "./components/authentication/UpdateProfile";
import Home from "./components/Home";
import Shop from "./components/shop/Shop";
import Navbar from "./components/navbar/Navbar";
import Admin from "./components/Admin";
import './App.css'
import AboutMe from "./components/aboutMe/AboutMe";
import ProdDetals from "./components/shop/ProdDetals";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/shop" component={Shop} />
          <Route exact path="/shop/:id" component={ProdDetals} />
          <Route exact path="/aboutMe" component={AboutMe} />
          <Route exact path="/admin" component={Admin} />

          {/* Profile */}
          <PrivateRoute  path="/user" component={Profile} />
          <PrivateRoute  path="/update-profile" component={UpdateProfile} />
          {/* Auth */}
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
