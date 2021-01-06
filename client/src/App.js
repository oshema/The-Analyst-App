import React from 'react';
import './App.css';
import ProtectedRoute from './components/protectedRoute'
import Login from './components/login'
import Register from './components/register'
import Home from './pages/home'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';



function App() {


  return (
    <Router>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/" exact={true} component={Home} />
        <div className="loginLayout">
        </div>
      </Switch>
    </Router>
  );
}

export default App;
