import React from "react";
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class StockProductTable extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {};
        //for access this event this keyword need to bind for the function     
        // this.loadStockTable = this.loadStockTable.bind(this);

    }

    // componentDidMount() {
    //     this.loadStockTable();
    // }

    // componentDidUpdate() {
    //     this.loadStockTable();
    // }

    // loadStockTable() {
    //     const self = this;
    //     const grnStockArray = localStorage.getItem('grnStockArray');
    //     // const stockProducts = JSON.parse(localStorage.getItem('myarray'));
    //     const stockProducts = JSON.parse(grnStockArray);
    //     console.log(stockProducts);
    //     let tableBody = "";
    //     let i = 1;
    //     stockProducts.forEach(function (value, index) {
    //         tableBody += '<tr>';
    //         tableBody += '<td>' + i + '</td>';
    //         tableBody += '<td>' + value.product_name + '</td>';
    //         tableBody += '<td>' + value.qty + '</td>';
    //         tableBody += '<td>' + value.selling_price + '</td>';
    //         tableBody += '<td>' + value.stock_price + '</td>';
    //         tableBody += '<td>' + value.wholesale_price + '</td>';
    //         tableBody += '<td>' + value.description + '</td>';
    //         tableBody += '<td><button class="btn btn-danger text-white btn-removeStock" value="' + index + '"><FontAwesomeIcon icon="trash-alt"/> Remove</button></div></td>';
    //         tableBody += '<tr>';
    //         i++;
    //     });
    //     $('#tblStock tbody').html('').append(tableBody);

    //     $('.btn-removeStock').click(function(e){
    //         e.preventDefault();
    //         const product_index = $(this).val();
    //         console.log(stockProducts[product_index]);
    //         // console.log(grnStockArray);
    //         stockProducts.splice(product_index,1); 
    //         // delete stockProducts[product_index];
    //         console.log("XXXXX"+stockProducts);
    //         localStorage.setItem('grnStockArray', JSON.stringify(stockProducts));            
    //         // localStorage.removeItem("grnStockArray");
    //     });
    // }

    render() {
        return (
            <table id="tblStock" className="table table-hover table-responsive table-striped">
                <thead className="table-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Stock Price</th>
                        <th scope="col">Selling Price</th>
                        <th scope="col">Wholesale Price</th>
                        <th scope="col">Description</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="8" className="text-center">Products Not Added!</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default StockProductTable;