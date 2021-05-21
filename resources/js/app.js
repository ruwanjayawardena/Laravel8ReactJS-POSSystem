require('./bootstrap');
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import './App.css';

import AdminDashboard from './views/AdminDashboard';
import CashierDashboard from './views/CashierDashboard';

function App() {
  return (
    // <div className="wrapper">      
      <BrowserRouter>
        <Switch>
          <Route path="/Administrator">
            <AdminDashboard />
          </Route>
          <Route path="/Cashier">           
            <CashierDashboard/>
          </Route>
        </Switch>
      </BrowserRouter>
    // </div>
  );
}

export default App;

const root = document.getElementById('app');
if (document.getElementById('app')) {
    ReactDOM.render(<App/>, root);
}




/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

//require('./components/TestFunctions/run');


// require('./views/AdminDashboard');
// require('./views/CashierDashboard');

