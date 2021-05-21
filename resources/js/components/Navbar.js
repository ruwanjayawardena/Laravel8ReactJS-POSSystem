import React, { component } from 'react';
//import ReactDOM from 'react-dom';
//import bootstrap from 'bootstrap';
import * as boostrapIcon from "react-icons/bs";
//import { Link } from 'react-router-dom';
import { Route, BrowserRouter as Router, Switch, Link, Redirect } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import Maincategory from './Pages/Maincategory';
import Sub1category from './Pages/Sub1category';
import Sub2category from './Pages/Sub2category';
import Product from './Pages/Product';
import Stock from './Pages/Stock';
import Supplier from './Pages/Supplier';
import Grn from './Pages/Grn';
import GrnReturn from './Pages/GrnReturn';
import RemoveStock from './Pages/RemoveStock';
import StockReport from './Pages/StockReport';
import Customer from './Pages/Customer';
import Outlet from './Pages/Outlet';
import BillReport from './Pages/BillReport';
// import Billing from './Pages/Billing';
// import WeatherCRUD from './Pages/WeatherCRUD';
// import Samplepage from './Pages/Samplepage';
import './Fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Navbar() {
    return (
        <Router>
            <main className="flex-shrink-0 d-print-none">
                <nav className="navbar navbar-expand-lg navbar-dark shadow sticky-top">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/Administrator/"><span className="fs-4 fw-bolder">                            
                            <img src="../../img/logo/lion2.png" className="img-fluid p-1" style={{ width: 50 + 'px' }} />
                            {/* <FontAwesomeIcon icon="desktop" />  */}
                            Singha Hardware</span>
                            {/* <span className="fs-5 text-white"> POS</span> */}
                            </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav text-center">
                                {/* <li className="nav-item">
                                    <Link to="/Administrator/" className="nav-link active">
                                        <FontAwesomeIcon icon="home" size="2x" /><br />Home
                        </Link>
                                </li> */}
                                <li className="nav-item">
                                    <Link to="/Administrator/maincategory" className="nav-link">
                                        <FontAwesomeIcon icon="sitemap" size="2x" /><br />Item Setup
                        </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/sub1category" className="nav-link">
                                        <FontAwesomeIcon icon="sitemap" size="2x" /><br />Main Categorization
                        </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/Sub2category" className="nav-link">
                                        <FontAwesomeIcon icon="sitemap" size="2x" /><br />Sub Categorization
                        </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/Product" className="nav-link">
                                        <FontAwesomeIcon icon="box-open" size="2x" /><br />Stock
                        </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/StockReport" className="nav-link">
                                        <FontAwesomeIcon icon="file-alt" size="2x" /><br />Full Items Stock Report
                        </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/Grn" className="nav-link">
                                        <FontAwesomeIcon icon="truck-loading" size="2x" /><br />GRN & Return
                        </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/GrnReturn" className="nav-link">
                                        <FontAwesomeIcon icon="file-alt" size="2x" /><br />(GRN) Stock Return Report
                        </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/RemoveStock" className="nav-link">
                                        <FontAwesomeIcon icon="trash" size="2x" /><br />Remove Stock
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/Customer" className="nav-link">
                                        <FontAwesomeIcon icon="people-carry" size="2x" /><br />Customer
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/Outlet" className="nav-link">
                                        <FontAwesomeIcon icon="store" size="2x" /><br />Outlet Setup
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/Administrator/BillReport" className="nav-link">
                                        <FontAwesomeIcon icon="receipt" size="2x" /><br />Bill Report
                                    </Link>
                                </li>

                                {/* <li className="nav-item">
                        <Link to="/Stock" className="nav-link">
                            <FontAwesomeIcon icon="sitemap" size="2x"/><br/>Product Stock Receive Report
                        </Link>
                    </li>                */}
                                <li className="nav-item">
                                    <Link to="/Administrator/Supplier" className="nav-link">
                                        <FontAwesomeIcon icon="truck" size="2x" /><br /> Supplier
                        </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link to="/Administrator/Billing" className="nav-link">
                                        <FontAwesomeIcon icon="file-invoice-dollar" size="2x" /><br /> Billing
                        </Link>
                                </li> */}
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">
                                        <FontAwesomeIcon icon="arrow-alt-circle-left" size="2x" /><br /> Go Back
                        </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </main>
            <div className="flex-shrink-1">
                <Switch>
                    <Route path="/Administrator/maincategory" component={Maincategory}></Route>
                    <Route path="/Administrator/sub1category" component={Sub1category}></Route>
                    <Route path="/Administrator/Sub2category" component={Sub2category} ></Route>
                    <Route path="/Administrator/Product" component={Product} ></Route>
                    <Route path="/Administrator/Grn" component={Grn} ></Route>
                    <Route path="/Administrator/Stock" component={Stock} ></Route>
                    <Route path="/Administrator/Supplier" component={Supplier} ></Route>
                    <Route path="/Administrator/GrnReturn" component={GrnReturn} ></Route>
                    <Route path="/Administrator/RemoveStock" component={RemoveStock} ></Route>
                    <Route path="/Administrator/StockReport" component={StockReport} ></Route>
                    <Route path="/Administrator/Customer" component={Customer} ></Route>
                    <Route path="/Administrator/Outlet" component={Outlet} ></Route>
                    <Route path="/Administrator/BillReport" component={BillReport} ></Route>
                    {/* <Route path="/Administrator/Billing" component={Billing} ></Route> */}
                    <Route path="/Administrator/" component={Dashboard}></Route>
                    {/* <Redirect exact from="/Administrator" to="/"/>    */}
                    <Route path="/" render={() => location.reload('/')}></Route>
                </Switch>
            </div>
        </Router >

    );
}

export default Navbar

