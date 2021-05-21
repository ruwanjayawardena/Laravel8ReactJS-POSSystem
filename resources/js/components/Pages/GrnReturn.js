import React from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class GrnReturn extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            stockArray: []
        };
        //for access this event this keyword need to bind for the function
        this.loadDataTable = this.loadDataTable.bind(this);
        
    }
    // componentDidUpdate() {
    // }
    componentDidMount() {
        // From StockProductTable
        this.loadDataTable();
    }   
    
    
    loadDataTable() {
        const self = this;
        const tblurl = '/api/report/returngrn';
        $('#tbl').DataTable({
            processing: true,
            language: {
                'processing': '<div class="spinner-border" role="status"></div><span class="">Loading...</span> '
            },
            destroy: true,
            serverSide: true,
            ajax: {
                'url': tblurl,
                'type': "POST"
            },
            columns: [
                { data: 'id' },
                { data: 'reference_no' },
                {
                    data: "supplier_info", render: function (data, type, row) {
                        const supplier_info = row.name + '<br>' + row.contact_person + '<br>' + row.contact_no;
                        return supplier_info;
                    }
                },
                { data: 'total' },
                { data: 'return_note' },
                { data: 'updated_at' },
                {
                    data: "action", render: function (data, type, row) {
                        switch (row.status) {
                            case 0:
                            return '<div class="d-grid gap-2 d-print-none"><button class="btn btn-dark btn-viewStock" value="' + row.id + '-' + row.reference_no + '">View</button><button class="btn btn-danger text-white btn-deleterow" value="' + row.id + '"><FontAwesomeIcon icon="trash-alt"/>Full  Stock Return</button></div>';
                            break;
                            case 1:
                            return '<div class="text-center"><div class="d-grid gap-2 mb-1 d-print-none"><button class="btn btn-dark btn-viewStock" value="' + row.id + '-' + row.reference_no + '">View</button></div><span class="badge bg-danger fs-6 text-center">Fully Returned</span></div>';
                            break;
                            case 2:
                            return '<div class="text-center"><div class="d-grid gap-2 mb-1 d-print-none"><button class="mb-1 btn-block btn btn-dark btn-viewStock" value="' + row.id + '-' + row.reference_no + '">View</button></div><span class="badge bg-warning text-dark fs-6">Partially Returned</span></div>';
                            break;
                        }
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
                
                function stockModalTable(jsonData, callback) {
                    let tableBody = "";
                    let tableFoot = "";
                    let i = 1;
                    let total = 0;
                    if (parseInt(jsonData.length) == 0) {
                        total = parseFloat(0).toFixed(2);
                        tableBody += '<tr>';
                        tableBody += '<th class="text-center" colspan="8"> Stock Not Added </td>';
                        tableBody += '<tr>';
                    } else {
                        jsonData.forEach(function (value, index) {
                            total += (parseFloat(value.qty).toFixed(1) * parseFloat(value.stock_price).toFixed(2));
                            tableBody += '<tr>';
                            tableBody += '<td>' + i + '</td>';
                            tableBody += '<td>' + value.product_name + '</td>';
                            tableBody += '<td>' + value.returned_qty + '</td>'; 
                            tableBody += '<td>' + value.stock_price + '</td>';
                            tableBody += '<td>' + value.return_note + '</td>';
                            tableBody += '<td>' + value.returnstock_updated_at + '</td>';
                            //0 -Project Just Created, 1 - Full Returned , 2 - Partial Returned
                            switch (value.status) {                                
                                case 1:
                                tableBody += '<td class="text-center"><span class="badge bg-danger fs-6 text-center">Fully Returned</span></td>';
                                break;
                                case 2:
                                tableBody += '<td class="text-center"><span class="badge bg-warning text-dark fs-6">Partially Returned</span></td>';
                                break;
                            }
                            tableBody += '</tr>';
                            i++;
                        });
                    }
                    $('#tblStockView tbody').html('').append(tableBody);
                    tableFoot += '<tr><th colspan="3">Total</th><th colspan="5" class="text-left">' + parseFloat(total).toFixed(2) + '</th></tr>'
                    $('#tblStockView tfoot').html('').append(tableFoot);
                    
                    if (callback instanceof Function) {
                        callback();
                    }
                }
                
                
                //load view stock modal 
                $('.btn-viewStock').click(function () {
                    let GrnClickString = $(this).val();
                    let GrnClickAr = GrnClickString.split('-');
                    
                    const id = GrnClickAr[0];
                    $('.modal-viewstockheading').html('').append('Reference No: ' + GrnClickAr[1] + ' Stocked Items');
                    
                    const STKVIEWMODAL = $('#stockViewmodal');
                    STKVIEWMODAL.modal('show');
                    const url = '/api/report/returnstock/' + id;
                    axios.get(url)
                    .then(function (response) {
                        // handle success
                        let jsonStockData = response.data;                        
                        stockModalTable(jsonStockData);
                    });
                });
            }
        });
    }
    
    render() {
        return (
            <div className="container py-5 px-2">
            {/* view modal */}
            <div className="modal" id="stockViewmodal" show="true" >
            <div className="modal-dialog modal-xl">
            <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title modal-viewstockheading">Returned Stock Items</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            {/* modal body */}
            <div className="row">
            <div className="col-12 col">
            <table id="tblStockView" className="table table-hover table-responsive table-striped">
            <thead className="table-light">
            <tr>
            <th scope="col">#</th>
            <th scope="col">Product</th>
            <th scope="col">Qty</th>
            <th scope="col">Stock Received Unit Price</th>
            <th scope="col">Return Note</th>
            <th scope="col">Return Date</th>
            <th scope="col">Status</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td colSpan="8" className="text-center">Stock not found</td>
            </tr>
            </tbody>
            <tfoot>
            </tfoot>
            </table>
            </div>
            </div>
            {/* modal body end */}
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
            </div>
            </div>
            {/* view modal end */}
            <div className="row">
            <h3 className="display-6"><FontAwesomeIcon icon="file-alt" /> (GRN) Stock Return Report </h3>
            <p className="lead text-muted fs-6 mb-4"> View all information about retured stock</p>
            
            <div className="col-12 col-md-12">
            <table id="tbl" className="table table-hover table-responsive table-bordered">
            <thead className="table-dark">
            <tr>
            <th scope="col">#</th>
            <th scope="col">GRN Reference</th>
            <th scope="col">Supplier</th>
            <th scope="col">Total</th>
            <th scope="col">Description</th>
            <th scope="col">Last Updated On</th>
            <th scope="col">Status</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
            </table>
            </div>
            </div>
            </div >
            );
        }
    }
    
    export default GrnReturn;