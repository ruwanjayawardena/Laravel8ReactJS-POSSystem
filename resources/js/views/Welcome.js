import React from 'react';
import ReactDOM from 'react-dom';

// import { Route, BrowserRouter as Router, Switch, Link, Redirect } from "react-router-dom";
function Welcome() {
    return (
        <div className="container-fluid dashboard-background">
            <div className="row">
                <div className="col-12 col-lg-12">
                    <section className="center-item">
                        <h1 className="text-center text-white display-5 animated fadeInLeft slow mb-3">
                            POS Singha Hardware<span className="badge bg-secondary">singhahardwaremetal.com</span></h1>                        
                        <div class="row row-cols-1 row-cols-md-2 g-4 text-center">
                            <div class="col">
                                <div class="card bg-secondary hvr-grow">
                                    <img src="./img/card/stock.png" class="card-img-top img-fluid" />
                                    <div class="card-body text-white">
                                        <h5 class="card-title">Stock Administration</h5>
                                        <p class="card-text">Configure POS Back-end.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card bg-dark hvr-rotate">
                                    <img src="./img/card/bill.png" class="card-img-top img-fluid" />
                                    <div class="card-body text-white">
                                        <h5 class="card-title">Billing</h5>
                                        <p class="card-text">Chashier Billing Section</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </section>
                </div>
            </div>
        </div>
    )
}

export default Welcome

const root = document.getElementById('app');
if (document.getElementById('app')) {
    ReactDOM.render(<Welcome />, root);
}
