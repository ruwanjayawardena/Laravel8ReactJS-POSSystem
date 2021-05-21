import React from 'react';
import Billing from '../components/Pages/Billing';
import BillReportCashier from '../components/Pages/BillReportCashier';
import '../components/Fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";

class CashierDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    viewBillReportModal() {
        $('#viewBillReportModal').modal('show');
    }

    render() {
        return (
            <div>
                {/* customer add and bill final modal */}
                <div className="modal" id="viewBillReportModal" show="true" >
                    <div className="modal-dialog modal-fullscreen">
                        <div className="modal-content">
                            <div className="modal-header d-print-none">
                                <h5 className="modal-title">Bill Report</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row px-3">
                                    <BillReportCashier />
                                </div>
                            </div>
                            <div className="modal-footer d-print-none">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end of customer add and bill final modal */}
                <Router>
                    <main className="flex-shrink-0 d-print-none">
                        <nav className="navbar navbar-expand-lg shadow sticky-top billing-navbar">
                            <div className="container-fluid">
                                <a className="navbar-brand" href="#"><span className="fs-4 fw-bolder">
                                    {/* <FontAwesomeIcon icon="desktop" /> */}
                                    <img src="../../img/logo/lion2.png" className="img-fluid img-thumbnail me-2" style={{ width: 50 + 'px', height: 50 + 'px' }} />
                                     Singha Hardware</span>
                                    {/* <span className="fs-5 text-white"> POS</span> */}
                                </a>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav text-end border-1">
                                        <li className="nav-item btn btn-sm btn-outline-primary">
                                            <Link to="/" className="nav-link text-white"><FontAwesomeIcon icon="arrow-alt-circle-left" size="lg" /> Go Back</Link>
                                        </li>
                                    </ul>
                                    {/* <button className="btn btn-outline-secondary">View Bill</button> */}
                                </div>
                                <div className="d-grid gap-2 d-flex justify-content-end">
                                    <button className="btn btn-secondary text-white me-md-2" onClick={this.viewBillReportModal}>Bill Report</button>
                                    {/* <button className="btn btn-outline-success" type="button">View Bill</button> */}
                                </div>
                            </div>
                        </nav>
                    </main>
                    <Switch>
                        <Route path="/Cashier/" component={Billing}></Route>
                        <Route path="/" render={() => location.reload('/')}></Route>
                    </Switch>
                </Router>
            </div>
        )

    }


}
export default CashierDashboard
