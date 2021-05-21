import React from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class BillReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        //for access this event this keyword need to bind for the function
        this.loadReport = this.loadReport.bind(this);
        this.closeInvoice = this.closeInvoice.bind(this);
    }

    componentDidMount() {
        this.loadReport();
    }

    closeInvoice() {
        $('#viewBillModal').modal('hide');
    }


    loadReport() {
        const self = this;
        const tblurl = '/api/report/bill';
        const postData = {
            start_date: $('#start_date').val(),
            end_date: $('#end_date').val()
        }
        const index = 0;
        $('#tbl').DataTable({
            processing: true,
            language: {
                'processing': '<div class="spinner-border" role="status"></div><span class="">Loading...</span> '
            },
            destroy: true,
            serverSide: true,
            ajax: {
                'url': tblurl,
                'type': "POST",
                'data': postData
            },
            columns: [
                { data: 'bill_no' },
                { data: 'bl_created_at' },
                { data: 'bl_net_total' },
                { data: 'bl_discount_total' },
                { data: 'bl_paid_total' },
                { data: 'bl_balance_due' },
                { data: 'bl_note' },
                //0 -cancelled bill, 1 - completed bill , 2 - Partially completed bill(uncompleted)
                {
                    data: "action", render: function (data, type, row) {
                        var htmlobj = "";                      
                        
                        switch (parseInt(row.bl_status)) {
                            case 0:
                                htmlobj += '<span class="badge bg-danger fs-6">Cancelled</span>';
                                break;
                            case 1:
                                htmlobj += '<span class="badge bg-success fs-6">Completed</span>';
                                break;
                            case 2:
                                htmlobj += '<span class="badge bg-warning fs-6">Uncompleted (Advanced Paid)</span>';
                                break;
                        }
                        htmlobj += '<br/>';
                        switch (parseInt(row.bl_auth_status)) {
                            case 0:
                                htmlobj += '<span class="badge bg-secondary mt-1 fs-6">Bill not checked</span>';
                                break;
                            case 1:
                                htmlobj += '<span class="badge bg-primary mt-1 fs-6">Bill checked</span>';
                                break;
                        }
                        return htmlobj;
                    }
                },
                {
                    data: "action", render: function (data, type, row) {                       
                        return '<button class="btn btn-dark btn-viewBill" value="' + row.id + '">View</button>';
                        
                    }
                },
            ],
            dom:
                "<'row'" +
                "<'col-md-12 col-12'" +
                "<'d-flex justify-content-between'" +
                "<'p-2'l>" +
                "<'p-2 align-self-center'B>" +
                "<'p-2'f>" +
                ">" +
                ">" +
                ">" +
                "<'row'" +
                "<'col-md-12 col-12'" +
                "<'dt-table' tr>" +
                ">" +
                ">" +
                "<'row'" +
                "<'col-md-12 col-12'" +
                "<'d-flex justify-content-start'i>" +
                "<'d-flex justify-content-end'p>" +
                ">" +
                ">",
            buttons: [
                'csv', 'excel', 'pdf', 'print'
            ],
            bInfo: false,
            drawCallback: () => {

                $('.btn-cancelBill').click(function () {
                    const id = $(this).val();
                    const url = '/api/bill/cancel/' + id;
                    Swal.fire({
                        title: 'Bill Cancellation!',
                        text: "Are you sure want to cancel this bill ?",
                        icon: 'info',
                        showCancelButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            axios.get(url)
                                .then(function (response) {
                                    const jsonData = response.data;
                                    if (jsonData.msgType == 1) {
                                        self.loadReport();
                                        Swal.fire({
                                            title: 'Bill Cancellation!',
                                            text: jsonData.message,
                                            icon: 'success',
                                        });
                                    } else {
                                        Swal.fire({
                                            title: 'Bill Cancellation!',
                                            text: jsonData.message,
                                            icon: 'warning',
                                        });
                                    }
                                }).catch(function (error) {
                                    // handle error
                                    console.log(error);
                                });
                        }
                    });
                });

                $('.btn-checkAuth').click(function () {
                    const id = $(this).val();
                    const url = '/api/bill/checkauth/' + id;
                    Swal.fire({
                        title: 'Bill Checking!',
                        text: "Are you sure want to mark this bill as checked?",
                        icon: 'info',
                        showCancelButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            axios.get(url)
                                .then(function (response) {
                                    const jsonData = response.data;
                                    if (jsonData.msgType == 1) {
                                        self.loadReport();
                                        Swal.fire({
                                            title: 'Bill Checking!',
                                            text: jsonData.message,
                                            icon: 'success',
                                        });
                                    } else {
                                        Swal.fire({
                                            title: 'Bill Checking!',
                                            text: jsonData.message,
                                            icon: 'warning',
                                        });
                                    }
                                }).catch(function (error) {
                                    // handle error
                                    console.log(error);
                                });
                        }
                    });

                });

                $('.btn-viewBill').click(function () {
                    const id = $(this).val();
                    const billInfoUrl = '/api/bill/' + id;
                    const billItemInfoUrl = '/api/bill/items/' + id;
                    const billCustomerInfoUrl = '/api/bill/customer/' + id;
                    axios.get(billInfoUrl)
                        .then(function (response) {
                            // handle success
                            $('#viewBillModal').modal('show');
                            let jsonData = response.data;
                            jsonData.forEach((qData, index) => {
                                $('.bl_net_total').html('').append(parseFloat(qData.bl_net_total).toFixed(2));
                                $('.bl_discount_total').html('').append(parseFloat(qData.bl_discount_total).toFixed(2));
                                $('.bl_paid_total').html('').append(parseFloat(qData.bl_paid_total).toFixed(2));
                                $('.bl_balance_due').html('').append(parseFloat(qData.bl_balance_due).toFixed(2));
                                $('.bl_created_at').html('').append(qData.bl_created_at);
                                $('.bl_note').html('').append(qData.bl_note);
                                $('.bill_no').html('').append(qData.bill_no);
                            });

                        })
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });

                    axios.get(billItemInfoUrl)
                        .then(function (response) {
                            // handle success                            
                            let jsonData = response.data;
                            let tableData = ""
                            jsonData.forEach((qData, index) => {
                                index++;
                                tableData += '<tr>';
                                tableData += '<td>' + index + '</td>';
                                tableData += '<td>' + qData.product_code + '<br>' + qData.product + '<br>' + qData.subcategory + ' | ' + qData.sub2category + '</td>';
                                tableData += '<td>' + qData.bitm_qty + '</td>';
                                tableData += '<td class="text-end">' + parseFloat(qData.bitm_sold_price).toFixed(2) + '</td>';
                                tableData += '<td class="text-end">' + parseFloat(qData.bitm_subtotal).toFixed(2) + '</td>';
                                tableData += '</tr>';
                            });
                            $('#tblItems tbody').html('').append(tableData);

                        })
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });

                    axios.get(billCustomerInfoUrl)
                        .then(function (response) {
                            // handle success                            
                            let jsonData = response.data;
                            jsonData.forEach((qData, index) => {
                                $('.customer_info').html('').append(qData.customer_info)
                            });
                        })
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });
                    // alert(id);

                });


            }
        });
    }

    render() {
        return (
            <div className="container py-5 px-2">
                {/* start modal */}
                <div className="modal" id="viewBillModal" show="true" >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header d-print-none">
                                <h5 className="modal-title modal-viewstockheading">Invoice</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body px-3 print-invoice">
                                <div className="row">
                                <div className="col-8">
                                        <div className="row">
                                            <div className="col-1 p-0">
                                                <img src="../../img/logo/lion2.png" className="img-fluid p-1" style={{ width: 60 + 'px' }} />
                                            </div>
                                            <div className="col-11">
                                                <h2 className="display-6">Singha Hardware & Industries</h2>
                                                <p>No 812, Colombo Road, 2nd Kurana, Negombo<br />TEL: 077 431 0052 | 077 432 9250</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4 text-end">
                                        <h1 className="fw-bolder">INVOICE</h1>
                                        <dl className="row">
                                            <dt className="col-8">Invoice No: </dt>
                                            <dd className="col-4"><span className="bill_no"></span></dd>
                                            <dt className="col-8">Date: </dt>
                                            <dd className="col-4"><span className="bl_created_at"></span></dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <dl className="row">
                                            <dt className="col-sm-1">Bill To: </dt>
                                            <dd className="col-sm-12 customer_info"></dd>
                                        </dl>
                                    </div>
                                </div>
                                <div className="row">
                                    <table id="tblItems" className="table table-hover table-responsive table-bordered text-center">
                                        <thead className="table-dark">
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Qty</th>
                                                <th scope="col">Unit Price</th>
                                                <th scope="col">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colSpan="2" rowSpan="4"><span className="bl_note"></span></th>
                                                <th colSpan="2" className="text-end">Sub Total</th>
                                                <th className="bl_net_total text-end">0.00</th>
                                            </tr>
                                            <tr>
                                                <th colSpan="2" className="text-end">Discount</th>
                                                <th className="bl_discount_total text-end">0.00</th>
                                            </tr>
                                            <tr>
                                                <th colSpan="2" className="text-end">Amount Paid</th>
                                                <th className="bl_paid_total text-end">0.00</th>
                                            </tr>
                                            <tr>
                                                <th colSpan="2" className="text-end text-end">Balance Due</th>
                                                <th className="bl_balance_due text-decoration-underline text-end">0.00</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer d-print-none">
                                <button type="button" className="btn btn-secondary btn-closeInvoice" onClick={this.closeInvoice}>Close</button>
                                <button type="button" className="btn btn-primary text-white" onClick={window.print}>Print</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end modal */}
                <div className="row d-print-none">
                    <h3 className="display-6"><FontAwesomeIcon icon="receipt" /> Bill Report </h3>
                    <p className="lead text-muted fs-6 mb-4"> View all billing infomations</p>
                    <div className="row">
                        <div className="col">
                            <div className="form-floating mb-3">
                                <input type="date" className="form-control" id="start_date" autoComplete="off" required />
                                <label htmlFor="start_date">Start</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating mb-3">
                                <input type="date" className="form-control" id="end_date" autoComplete="off" required />
                                <label htmlFor="end_date">End</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="py-2 d-grid gap-2 d-md-block">
                                <button type="button" className="btn btn-success text-white btn-save" onClick={this.loadReport}>
                                    <FontAwesomeIcon icon="receipt" /> Generate Report
            </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row d-print-none">
                    <div className="col-12 col-md-12 w-100">
                        <table id="tbl" className="table table-hover table-responsive table-bordered w-100">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Bill No</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Net Total</th>
                                    <th scope="col">Discount Total</th>
                                    <th scope="col">Paid Amount</th>
                                    <th scope="col">Balance Due</th>
                                    <th scope="col">Bill Note</th>
                                    <th scope="col">Status</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        );
    }
}

export default BillReport;