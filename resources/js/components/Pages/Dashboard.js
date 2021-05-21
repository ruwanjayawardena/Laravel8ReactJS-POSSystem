import React from 'react'

function Dashboard() {
    return (
        <div>
            <div className="container">
                <div className="row py-5">
                    <div className="col text-end">
                        <img src="../../../img/logo/lion.png" className="img-fluid" style={{width:85+'%'}} />
                    </div>
                    <div className="col">
                        <div className="px-4 pt-5 my-5 text-center border-bottom">
                            <h1 className="display-4 fw-bold">
                                Welcome to Singha Hardware & Industries<br /><span className="badge fs-1 fw-lighter bg-secondary">Cloud Based Point Of Sale System</span></h1>
                            <div className="col-lg-6 mx-auto">
                                <p className="lead mb-4">Desingned By Ruwan Jayawardena <span className="badge rounded-pill bg-dark">Full Stack Web App Engineer</span>
                                    <img src="https://www.wfd.org/wp-content/uploads/2019/10/LK-Sri-Lanka-Flag-icon.png" width="60px" />
                                </p>
                                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
                                    <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3 text-white">Go Home</button>
                                    <button type="button" className="btn btn-outline-secondary btn-lg px-4">Learn More</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

