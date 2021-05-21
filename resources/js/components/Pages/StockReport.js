import React from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class StockReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        //for access this event this keyword need to bind for the function
        this.loadDataTable = this.loadDataTable.bind(this);
    }

    componentDidMount() {
        this.loadDataTable();
    }


    loadDataTable() {
        const self = this;
        const tblurl = '/api/report/product';
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
                { data: 'category' },
                { data: 'subcategory' },
                { data: 'sub2category' },
                { data: 'product_code' },
                { data: 'product' },
                { data: 'qty' },
                {
                    data: "price", render: function (data, type, row) {
                        return parseFloat(row.price).toFixed(2);
                    }
                },
                {
                    data: "wholesale_price", render: function (data, type, row) {
                        return parseFloat(row.wholesale_price).toFixed(2);
                    }
                },
                // { data: 'price' },
                // { data: 'wholesale_price' },
                { data: 'description' },
                { data: 'updated_at' },
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
            drawCallback: () => { }
        });
    }

    render() {
        return (
            <div className="container py-5 px-2">
                <div className="row">
                    <h3 className="display-6"><FontAwesomeIcon icon="file-alt" /> Product Stock Report </h3>
                    <p className="lead text-muted fs-6 mb-4"> View all information about stock products</p>

                    <div className="col-12 col-md-12">
                        <table id="tbl" className="table table-hover table-responsive table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Main Category</th>
                                    <th scope="col">Sub Category</th>
                                    <th scope="col">Sub 2 Category</th>
                                    <th scope="col">Product Code</th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Qty</th>
                                    <th scope="col">Selling Price</th>
                                    <th scope="col">Wholesale Price</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Last Update Date</th>
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

export default StockReport;