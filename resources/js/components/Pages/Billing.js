import React from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Customer from "./Customer";

class Billing extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            cmbMainCategoryOptions: [],
            selectedMainCatOption: [],
            cmbSubCategoryOptions: [],
            selectedSubCatOption: [],
            cmbSub2CategoryOptions: [],
            selectedSub2CatOption: [],
            cmbProductOptions: [],
            selectedProductOption: [],
            cmbCustomerOptions: [],
            cmbCustomerOptions: [],
            selectedCustomerOption: [],
            billCart: [],
            totalpayable: 0,
            payamount: 0,
            balanceDue: 0,
            discount: 0,
            chkCustomerSelect: 0
        };
        this.cmbMainCategory = this.cmbMainCategory.bind(this);
        this.cmbSubCategory = this.cmbSubCategory.bind(this);
        this.cmbSub2Category = this.cmbSub2Category.bind(this);
        this.cmbProducts = this.cmbProducts.bind(this);
        this.loadBillingCart = this.loadBillingCart.bind(this);
        this.emptyCart = this.emptyCart.bind(this);
        this.calculateBalanceDue = this.calculateBalanceDue.bind(this);
        this.createBill = this.createBill.bind(this);
        this.onChangeCustomer = this.onChangeCustomer.bind(this);
        this.cmbCustomer = this.cmbCustomer.bind(this);
        this.isCustomerSelect = this.isCustomerSelect.bind(this);
        this.addNewCustomerModal = this.addNewCustomerModal.bind(this);
        this.addNewCustomerModalHideEvent = this.addNewCustomerModalHideEvent.bind(this);
        this.billViewer = this.billViewer.bind(this);
        this.clearBilling = this.clearBilling.bind(this);

    }

    componentDidMount() {
        this.loadBillingCart();
        this.cmbMainCategory((selectedMC) => {
            this.cmbSubCategory(selectedMC, (selectedSC) => {
                this.cmbSub2Category(selectedSC);
            });
        });
        this.cmbCustomer();
        this.addNewCustomerModalHideEvent();
    }

    clearBilling() {
        this.setState({ billCart: [] });
        this.setState({ totalpayable: 0 });
        this.setState({ payamount: 0 });
        this.setState({ balanceDue: 0 });
        this.setState({ discount: 0 });
        this.setState({ chkCustomerSelect: 0 });
        $('.customerDiv').prop('hidden', true);
        localStorage.removeItem("billCart");
    }

    billViewer(id) {
        //load bill view modal        
        const billInfoUrl = '/api/bill/' + id;
        const billItemInfoUrl = '/api/bill/items/' + id;
        const billCustomerInfoUrl = '/api/bill/customer/' + id;
        axios.get(billInfoUrl)
            .then(function (response) {
                // handle success
                $('#billViewer').modal('show');
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
        //end of bill view modal
    }

    addNewCustomerModalHideEvent() {
        self = this;
        $("#customerModal").on("hidden.bs.modal", function () {
            self.cmbCustomer();
        });
    }



    addNewCustomerModal(event) {
        event.preventDefault();
        $('#customerModal').modal('show');
    }

    isCustomerSelect(event) {
        if (event.target.checked) {
            this.setState({ chkCustomerSelect: 1 });
            // console.log('checked');
            $('.customerDiv').prop('hidden', false);
        } else {
            this.setState({ chkCustomerSelect: 0 });
            // console.log('not checked');
            $('.customerDiv').prop('hidden', true);
        }

    }

    cmbCustomer() {
        const self = this;
        const url = '/api/cmb/customerdesc';
        self.setState({ selectedCustomerOption: [] });
        self.setState({ cmbCustomerOptions: [] });
        axios.get(url)
            .then(function (response) {
                // handle success             
                const json = response.data;
                let cmbOption;
                let label = "";
                $.each(json, function (index, cusData) {
                    label = cusData.cus_name + '| ' + cusData.cus_contact_no + '| ' + cusData.cus_address;
                    cmbOption = { value: cusData.id, label: label }
                    if (index == 0) {
                        self.setState({ selectedCustomerOption: cmbOption });
                    }
                    self.state.cmbCustomerOptions.push(cmbOption);
                });

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    onChangeCustomer(event) {
        this.setState({ selectedCustomerOption: event });
    }

    createBill(event) {
        let self = this;
        event.preventDefault();
        const form = document.getElementById('frm_cart');
        const payoption = event.target.value;

        //form validation add  
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {

            if (parseFloat(self.state.payamount) == 0) {
                Swal.fire({
                    title: 'Issuing Bill!',
                    text: 'Zero values not allowed as a payment',
                    icon: 'warning',
                });
            } else {
                const sessionCart = JSON.parse(localStorage.getItem('billCart'));
                if (sessionCart !== null) {
                    if (sessionCart.length !== 0) {
                        const url = '/api/bill';

                        const billitemArray = [];
                        let tempar;
                        let itemSubTotal = 0;
                        const sessionCart = JSON.parse(localStorage.getItem('billCart'));
                        sessionCart.forEach((qData, qIndex) => {
                            itemSubTotal = parseFloat(qData.cart_selling_price) * parseFloat(qData.cart_qty);
                            tempar = {
                                bitm_item: qData.product,
                                bitm_qty: qData.cart_qty,
                                bitm_sold_price: qData.cart_selling_price,
                                bitm_subtotal: itemSubTotal
                            }
                            billitemArray.push(tempar);
                            tempar = "";
                            itemSubTotal = 0;
                        });

                        if (parseInt(payoption) == 1) {
                            //cash pay 
                            const bill = {
                                bl_net_total: self.state.totalpayable,
                                bl_discount_total: self.state.discount,
                                bl_paid_total: self.state.payamount,
                                bl_balance_due: self.state.balanceDue,
                                bl_note: $('#pay_note').val(),
                                py_customer: self.state.selectedCustomerOption.value,
                                py_pay_type: payoption,
                                py_chq_info: '-',
                                billItemArray: billitemArray,
                                chkCustomerSelect: self.state.chkCustomerSelect
                            }

                            Swal.fire({
                                title: 'Issuing Bill!',
                                text: "Are you sure want to issue this bill?",
                                icon: 'info',
                                showCancelButton: true
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    axios.post(url, bill)
                                        .then(function (response) {
                                            // handle success
                                            console.log(response);
                                            const jsonData = response.data;
                                            if (jsonData.msgType == 1) {
                                                //form validation remove and clear form after success 
                                                form.reset();
                                                form.classList.remove('was-validated');
                                                Swal.fire({
                                                    title: 'Issuing Bill!',
                                                    text: jsonData.message,
                                                    icon: 'success'
                                                }).then((billSuccessResult) => {
                                                    if (billSuccessResult.isConfirmed) {
                                                        //load bill view modal
                                                        self.clearBilling();
                                                        self.loadBillingCart();
                                                        self.billViewer(jsonData.billID);
                                                        //end of bill view modal
                                                    }
                                                });
                                            } else {
                                                Swal.fire({
                                                    title: 'Issuing Bill!',
                                                    text: jsonData.message,
                                                    icon: 'warning',
                                                });
                                            }
                                        })
                                        .catch(function (error) {
                                            // handle error
                                            console.log("Error: " + error);
                                        });
                                }
                            });
                        } else {
                            //cheque pay
                            Swal.fire({
                                title: 'Cheque Info',
                                html:
                                    '<label for="py_chq_info" class="form-label badge bg-secondary text-left">Cheque Note</label>' +
                                    '<textarea id="py_chq_info" type="text" class="form-control" placeholder="Cheque Note Here">-</textarea>' +
                                    '</div>',
                                focusConfirm: false,
                                showCancelButton: true,
                                confirmButtonText: 'Issue',
                                preConfirm: function () {
                                    return new Promise(function (resolve) {
                                        if (true) {
                                            resolve([
                                                {
                                                    py_chq_info: document.getElementById('py_chq_info').value,
                                                }
                                            ]);

                                        }
                                    });
                                }
                            }).then(function (modalresult) {
                                if (modalresult.isConfirmed) {
                                    const bill2 = {
                                        bl_net_total: self.state.totalpayable,
                                        bl_discount_total: self.state.discount,
                                        bl_paid_total: self.state.payamount,
                                        bl_balance_due: self.state.balanceDue,
                                        bl_note: $('#pay_note').val(),
                                        py_customer: self.state.selectedCustomerOption.value,
                                        py_pay_type: payoption,
                                        py_chq_info: modalresult.value[0]['py_chq_info'],
                                        billItemArray: billitemArray,
                                        chkCustomerSelect: self.state.chkCustomerSelect
                                    }

                                    axios.post(url, bill2)
                                        .then(function (response) {
                                            // handle success
                                            console.log(response);
                                            const jsonData = response.data;
                                            if (jsonData.msgType == 1) {
                                                //form validation remove and clear form after success 
                                                form.reset();
                                                form.classList.remove('was-validated');
                                                Swal.fire({
                                                    title: 'Issuing Bill!',
                                                    text: jsonData.message,
                                                    icon: 'success'
                                                }).then((billSuccessResult) => {
                                                    if (billSuccessResult.isConfirmed) {
                                                        //load bill view modal
                                                        self.clearBilling();
                                                        self.loadBillingCart();
                                                        self.billViewer(jsonData.billID);
                                                        //end of bill view modal
                                                    }
                                                });
                                            } else {
                                                Swal.fire({
                                                    title: 'Issuing Bill!',
                                                    text: jsonData.message,
                                                    icon: 'warning',
                                                });
                                            }
                                        })
                                        .catch(function (error) {
                                            // handle error
                                            console.log("Error: " + error);
                                        });
                                }
                            });


                        }




                    } else {
                        Swal.fire({
                            title: 'Issuing Bill!',
                            text: 'Please add billing items and try again',
                            icon: 'warning',
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Issuing Bill!',
                        text: 'Please add billing items and try again',
                        icon: 'warning',
                    });
                }

            }
        }

    }

    calculateBalanceDue(event) {
        let payamount = event.target.value;
        let newpayamount = 0;
        let status = false;
        const regex = /^\d*\.?\d+$/;
        if (regex.test(payamount)) {
            if (payamount != 0) {
                status = true;
            }
        }
        if (status) {
            this.setState({ payamount: parseFloat(payamount).toFixed(2) });
            let calculateBalanceDue = (parseFloat(this.state.totalpayable) - parseFloat(payamount));
            this.setState({ balanceDue: parseFloat(calculateBalanceDue).toFixed(2) });
            $('#balance_due').val(parseFloat(calculateBalanceDue).toFixed(2));
        } else {
            // $('#pay_amount').val(parseFloat(0).toFixed(2));
            this.setState({ payamount: parseFloat(0).toFixed(2) })
            $('#balance_due').val(parseFloat(0).toFixed(2));
        }


        // this.setState({ payamount: event.target.value })
        // let calculateBalanceDue = (parseFloat(this.state.totalpayable) - parseFloat(event.target.value));
        // this.setState({ balanceDue: calculateBalanceDue });
        // $('#balance_due').val(calculateBalanceDue);
    }

    emptyCart() {
        Swal.fire({
            title: 'Delete All!',
            text: "Are you sure want to delete all billing cart items?",
            icon: 'info',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("billCart");
                Swal.fire({
                    title: 'Delete All!',
                    text: 'All billing cart items cleared.',
                    icon: 'success',
                });
                this.loadBillingCart();
            }
        });


    }

    loadBillingCart() {
        let self = this;
        let discount = 0;
        let cartItems = "";
        let itemTotal = 0;
        let subTotal = 0;
        let cartfooter = "";
        const sessionCart = JSON.parse(localStorage.getItem('billCart'));

        if (sessionCart !== null) {
            if (sessionCart.length !== 0) {
                sessionCart.forEach((cartData, cartIndex) => {
                    itemTotal = 0;
                    cartItems += '<tr>';
                    // cartItems += '<td ><img src="img/no_image.jpg" class="img-fluid cart-img"/></td>';
                    cartItems += '<td><div class="d-grid gap-2 col-6 mx-auto"><button class="btn btn-sm btn-warning btn-cartUpdate" value="' + cartData.sub2category_id + '">Edit</button><button class="btn btn-sm btn-danger btn-cartRemove text-white" value="' + cartData.sub2category_id + '">Delete</button></div></td>';
                    cartItems += '<td class="align-middle w-25"><span class="cart-product-name">' + cartData.product_name + '<br><small>' + cartData.subcategory_name + ' | ' + cartData.sub2category_name + '</small></span></td>';
                    cartItems += '<td class="align-middle"><input type="number" class="form-control" placeholder="Qty" value="' + cartData.cart_qty + '" readonly/></td>';
                    cartItems += '<td class="align-middle"><input type="text" class="form-control" placeholder="Price" value="' + cartData.cart_selling_price + '" readonly/></td>';
                    itemTotal = parseFloat(cartData.cart_qty) * parseFloat(cartData.cart_selling_price);
                    subTotal += itemTotal;
                    cartItems += '<td class="align-middle w-25 text-end">' + parseFloat(itemTotal).toFixed(2) + '</td>';
                    cartItems += '</tr>';
                    if (parseFloat(cartData.selling_price) > parseFloat(cartData.cart_selling_price)) {
                        discount += (parseFloat(cartData.selling_price) - parseFloat(cartData.cart_selling_price)) * parseFloat(cartData.cart_qty);
                    }
                });
            } else {
                cartItems += '<tr>';
                cartItems += '<td colspan="5" class="text-danger"> Empty Cart </td>';
                cartItems += '</tr>';
            }
        } else {
            cartItems += '<tr>';
            cartItems += '<td colspan="5" class="text-danger"> Empty Cart </td>';
            cartItems += '</tr>';
        }
        cartfooter += '<tr>';
        cartfooter += '<th colspan="4" class="text-end">Net Total</th>';
        cartfooter += '<th class="text-end">' + parseFloat(subTotal).toFixed(2) + '</th>';
        cartfooter += '</tr>';
        cartfooter += '<tr>';
        cartfooter += '<th colspan="4" class="text-end">Discount Received</th>';
        cartfooter += '<th class="text-end">' + parseFloat(discount).toFixed(2) + '</th>';
        cartfooter += '</tr>';

        $('#pay_amount').val(parseFloat(subTotal).toFixed(2));
        self.setState({ totalpayable: parseFloat(subTotal).toFixed(2) });
        self.setState({ payamount: parseFloat(subTotal).toFixed(2) });
        self.setState({ discount: parseFloat(discount).toFixed(2) });
        $('.carttable tbody').html('').append(cartItems);
        $('.carttable tfoot').html('').append(cartfooter);
        // self.cmbProducts(id);
        // self.state.billCart.push(cart_session_product_array);
        // localStorage.setItem('billCart', JSON.stringify(self.state.billCart));
        $('.btn-cartUpdate').click(function () {
            const id = $(this).val();
            self.cmbProducts(id);
        });
        $('.btn-cartRemove').click(function () {
            const id = $(this).val();
            const sessionCart = JSON.parse(localStorage.getItem('billCart'));

            if (sessionCart !== undefined || sessionCart.length !== 0 || sessionCart !== null || sessionCart !== "") {
                self.setState({ billCart: sessionCart });

                if (parseInt(self.state.billCart.length) != 0) {
                    self.state.billCart.forEach((cartData, cartIndex) => {
                        if (parseInt(cartData.sub2category_id) == parseInt(id)) {
                            self.state.billCart.splice(cartIndex, 1);
                        }
                    });
                    localStorage.setItem('billCart', JSON.stringify(self.state.billCart));
                }
            }
            self.loadBillingCart();
        });
        const cart = localStorage.getItem('billCart');
        console.log(cart);

        // localStorage.removeItem("grnStockArray");


    }

    cmbProducts(sub2category, callback) {
        const self = this;
        let selectedProductVal = null;
        //array  cleared
        self.setState({ selectedProductOption: [] });
        self.setState({ cmbProductOptions: [] });
        if (sub2category == null) {
            $('.productDiv').html('');
        } else {
            const url = '/api/cmb/products/' + sub2category;
            axios.get(url)
                .then(function (response) {
                    // handle success             
                    const json = response.data;
                    let cmbOption;
                    const count = Object.keys(json).length;
                    if (count == 0) {
                        // $('.productDiv').html('');                        
                        self.setState({ selectedProductOption: [] });
                        self.setState({ cmbProductOptions: [] });
                        Swal.fire({
                            title: 'Billing Item Selection',
                            text: 'Stock Not Available',
                            icon: 'warning',
                        });
                    } else {
                        let productDiv = "";
                        $.each(json, function (index, qData) {
                            cmbOption = { value: qData.id, label: qData.product }
                            if (parseInt(index) == 0) {
                                selectedProductVal = cmbOption.value;
                                self.setState({ selectedProductOption: cmbOption });
                                Swal.fire({
                                    title: 'Billing ' + qData.product,
                                    text: 'Allowed Qty: ' + qData.qty + ' | Selling Price: ' + qData.price + ' | Wholesale Price: ' + qData.wholesale_price,
                                    html:
                                        '<div class="mb-3 mt-4">' +
                                        '<dl class="row">' +
                                        '<dt class="col-7 text-left">Available Qty</dt>' +
                                        '<dd class="col-5">' + qData.qty + '</dd>' +
                                        '<dt class="col-7 text-left">Selling Price</dt>' +
                                        '<dd class="col-5">' + qData.price + '</dd>' +
                                        '<dt class="col-7 text-left">Wholesale Price</dt>' +
                                        '<dd class="col-5">' + qData.wholesale_price + '</dd>' +
                                        '</dl>' +
                                        '<div>' +
                                        '<div class="mb-3">' +
                                        '<label for="cart_qty" class="form-label badge bg-secondary text-left">Qty</label>' +
                                        '<input id="cart_qty" type="number" min="1" autocomplete="off" max="' + qData.qty + '" class="form-control" placeholder="Qty" value="' + qData.qty + '">' +
                                        '</div>' +
                                        '<div class="mb-3">' +
                                        '<label for="cart_selling_price" class="form-label badge bg-secondary text-left">Price</label>' +
                                        '<input id="cart_selling_price" autocomplete="off" type="text" class="form-control" placeholder="Selling Price" value="' + qData.price + '">' +
                                        '</div>',
                                    focusConfirm: false,
                                    showCancelButton: true,
                                    confirmButtonText: 'Add',
                                    preConfirm: function () {
                                        return new Promise(function (resolve) {
                                            if (true) {

                                                if ((parseFloat(qData.qty) >= parseFloat(document.getElementById('cart_qty').value)) && (parseFloat(document.getElementById('cart_qty').value) > 0)) {
                                                    const pattern = /^[0-9]+(\.[0-9]{1,2})?$/;
                                                    // pattern.test(document.getElementById('cart_selling_price').value);
                                                    if (pattern.test(document.getElementById('cart_selling_price').value)) {
                                                        resolve([
                                                            {
                                                                product: qData.id,
                                                                product_code: qData.product_code,
                                                                product_name: qData.product,
                                                                subcategory_name: self.state.selectedSubCatOption.label,
                                                                sub2category_name: self.state.selectedSub2CatOption.label,
                                                                sub2category_id: self.state.selectedSub2CatOption.value,
                                                                selling_price: qData.price,
                                                                wholesale_price: qData.wholesale_price,
                                                                cart_qty: document.getElementById('cart_qty').value,
                                                                cart_selling_price: document.getElementById('cart_selling_price').value
                                                            }
                                                        ]);
                                                    } else {
                                                        Swal.fire({
                                                            title: 'Alert!',
                                                            text: 'Selling Price should be in number format.',
                                                            icon: 'warning',
                                                        });
                                                    }
                                                } else {
                                                    Swal.fire({
                                                        title: 'Alert!',
                                                        text: 'Enter Valid item Qty.It should not 0 or over count of existing item Qty',
                                                        icon: 'warning',
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }).then(function (result) {

                                    if (result.isConfirmed) {
                                        const cart_session_product_array = {
                                            product: result.value[0]['product'],
                                            product_code: result.value[0]['product_code'],
                                            product_name: result.value[0]['product_name'],
                                            subcategory_name: result.value[0]['subcategory_name'],
                                            sub2category_name: result.value[0]['sub2category_name'],
                                            sub2category_id: result.value[0]['sub2category_id'],
                                            selling_price: result.value[0]['selling_price'],
                                            wholesale_price: result.value[0]['wholesale_price'],
                                            cart_qty: result.value[0]['cart_qty'],
                                            cart_selling_price: result.value[0]['cart_selling_price']
                                        }
                                        const sessionCart = JSON.parse(localStorage.getItem('billCart'));

                                        if (sessionCart !== null) {
                                            if (sessionCart.length !== 0) {
                                                if (parseInt(self.state.billCart.length) != 0) {
                                                    self.state.billCart.forEach((cartData, cartIndex) => {
                                                        if (parseInt(cartData.product) == parseInt(cart_session_product_array.product)) {
                                                            self.state.billCart.splice(cartIndex, 1);
                                                        }
                                                    });
                                                }
                                            }
                                        }

                                        self.state.billCart.push(cart_session_product_array);
                                        localStorage.setItem('billCart', JSON.stringify(self.state.billCart));
                                        const cart = localStorage.getItem('billCart');
                                        self.loadBillingCart();

                                        // localStorage.removeItem("grnStockArray");
                                    }
                                });




                            }
                            // productDiv += '<div class="col btn-card hvr-grow btn-product" id="pro-' + qData.id + '">' +
                            //     '<div class="card text-dark bg-light-cs card-pro">' +
                            //     '<div class="card-body text-center">' +
                            //     '<h6 class="card-title">' + qData.product + '</h6>' +
                            //     '</div>' +
                            //     '</div>' +
                            //     '</div>';
                        });
                        // $('.productDiv').html('').append(productDiv);
                        // $('#pro-' + selectedProductVal).find('.card-pro').addClass('card-pro-selected');

                        // $('.btn-product').click(function () {
                        //     $('.card-pro').removeClass('card-pro-selected');
                        //     const clickStr = $(this)[0].id;
                        //     const clickAr = clickStr.split('-');
                        //     const id = clickAr[1];
                        //     $('#pro-' + id).find('.card-pro').addClass('card-pro-selected');
                        //     const editurl = '/api/products/' + id;
                        //     axios.get(editurl)
                        //         .then(function (response) {
                        //             let jsonData = response.data;
                        //             jsonData.forEach((qProData, QProIndex) => {
                        //                 if (parseFloat(qProData.qty) == 0) {
                        //                     Swal.fire({
                        //                         title: 'Billing ' + qProData.product,
                        //                         text: 'Stock Not Available',
                        //                         icon: 'warning',
                        //                     });
                        //                 } else {


                        //                 }

                        //             });
                        //         });
                        // });
                    }
                    if (callback instanceof Function) {
                        callback(selectedProductVal);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    cmbSub2Category(subcategory, callback) {
        const self = this;
        let selectedS2CVal = null;
        //array  cleared
        self.setState({ selectedSub2CatOption: [] });
        self.setState({ cmbSub2CategoryOptions: [] });
        if (subcategory == null) {
            $('.productDiv').html('');
            $('.sub2Category').html('');
        } else {
            const url = '/api/cmb/sub2categories/' + subcategory;
            axios.get(url)
                .then(function (response) {
                    // handle success             
                    const json = response.data;
                    let cmbOption;
                    const count = Object.keys(json).length;
                    if (count == 0) {
                        $('.productDiv').html('');
                        $('.sub2Category').html('');
                        self.setState({ selectedSub2CatOption: [] });
                        self.setState({ cmbSub2CategoryOptions: [] });
                    } else {
                        let sub2Category = "";
                        $.each(json, function (index, qData) {
                            cmbOption = { value: qData.id, label: qData.sub2category }
                            if (parseInt(index) == 0) {
                                selectedS2CVal = cmbOption.value;
                                self.setState({ selectedSub2CatOption: cmbOption });
                            }
                            sub2Category += '<div class="col btn-card hvr-grow btn-sub2category" id="sc2-' + qData.id + '">' +
                                '<div class="card text-white bg-primary-cs card-sc2">' +
                                '<div class="card-body text-center">' +
                                '<h6 class="card-title">' + qData.sub2category + '</h6>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                        });
                        $('.sub2Category').html('').append(sub2Category);
                        // $('#sc2-' + selectedS2CVal).find('.card-sc2').addClass('card-sc2-selected');

                        $('.btn-sub2category').click(function () {
                            $('.card-sc2').removeClass('card-sc2-selected');
                            const clickStr = $(this)[0].id;
                            const clickAr = clickStr.split('-');
                            const id = clickAr[1];
                            const sb2cat = $('#sc2-' + id).find('.card-title').html();
                            const selectedOpt = { value: id, label: sb2cat }
                            self.setState({ selectedSub2CatOption: selectedOpt });
                            self.cmbProducts(id);
                            $('#sc2-' + id).find('.card-sc2').addClass('card-sc2-selected');
                        });
                    }
                    if (callback instanceof Function) {
                        callback(selectedS2CVal);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }


    }

    cmbSubCategory(maincategory, callback) {
        const self = this;
        let selectedSCVal = null;
        //array  cleared
        self.setState({ selectedSubCatOption: [] });
        self.setState({ cmbSubCategoryOptions: [] });
        if (maincategory == null) {
            $('.subCategory').html('');
            $('.sub2Category').html('');
            $('.productDiv').html('');
        } else {
            const url = '/api/cmb/sub1categories/' + maincategory;
            axios.get(url)
                .then(function (response) {
                    // handle success             
                    const json = response.data;
                    let cmbOption;
                    const count = Object.keys(json).length;
                    if (count == 0) {
                        $('.subCategory').html('');
                        $('.sub2Category').html('');
                        $('.productDiv').html('');
                        self.setState({ selectedSubCatOption: [] });
                        self.setState({ cmbSubCategoryOptions: [] });
                    } else {
                        let subCategory = "";
                        $.each(json, function (index, qData) {
                            cmbOption = { value: qData.id, label: qData.subcategory }
                            if (parseInt(index) == 0) {
                                selectedSCVal = cmbOption.value;
                                self.setState({ selectedSubCatOption: cmbOption });
                            }
                            subCategory += '<div class="col btn-card hvr-grow btn-subcategory" id="sc-' + qData.id + '">' +
                                '<div class="card text-white bg-secondary-cs card-sc">' +
                                '<div class="card-body text-center">' +
                                '<h6 class="card-title">' + qData.subcategory + '</h6>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                        });
                        $('.subCategory').html('').append(subCategory);
                        $('#sc-' + selectedSCVal).find('.card-sc').addClass('card-sc-selected');

                        $('.btn-subcategory').click(function () {
                            $('.card-sc').removeClass('card-sc-selected');
                            const clickStr = $(this)[0].id;
                            const clickAr = clickStr.split('-');
                            const id = clickAr[1];
                            const sbcat = $('#sc-' + id).find('.card-title').html();
                            const selectedOpt = { value: id, label: sbcat }
                            self.setState({ selectedSubCatOption: selectedOpt });
                            // console.log(xx);
                            $('#sc-' + id).find('.card-sc').addClass('card-sc-selected');
                            self.cmbSub2Category(id);
                            // self.cmbSub2Category(id, (selectedS2C) => {
                            //     self.cmbProducts(selectedS2C);
                            // });
                        });
                    }
                    if (callback instanceof Function) {
                        callback(selectedSCVal);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    }

    cmbMainCategory(callback) {
        const self = this;
        let selectedMCVal = null;
        self.setState({ selectedMainCatOption: [] });
        self.setState({ cmbMainCategoryOptions: [] });
        const url = '/api/cmb/maincategory';
        axios.get(url)
            .then(function (response) {
                // handle success             
                const json = response.data;
                let templabel = "";
                let cmbOption;
                const count = Object.keys(json).length;
                if (count == 0) {
                    self.setState({ selectedMainCatOption: [] });
                    self.setState({ cmbMainCategoryOptions: [] });
                } else {
                    let mainCategory = "";
                    $.each(json, function (index, maincategory) {
                        templabel = maincategory.code + '-' + maincategory.category;
                        cmbOption = { value: maincategory.id, label: templabel, code: maincategory.code }
                        if (parseInt(index) == 0) {
                            $('.mainCategory').html('');
                            $('.subCategory').html('');
                            $('.sub2Category').html('');
                            $('.productDiv').html('');
                            selectedMCVal = cmbOption.value;
                            self.setState({ selectedMainCatOption: cmbOption });
                        }
                        mainCategory += '<div class="col btn-card hvr-grow btn-maincategory" id="mc-' + maincategory.id + '">' +
                            '<div class="card text-white bg-dark-cs card-mc">' +
                            '<div class="card-body text-center">' +
                            '<h6 class="card-title text-uppercase">' + maincategory.category + '</h6>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    });
                    $('.mainCategory').html('').append(mainCategory);
                    $('#mc-' + selectedMCVal).find('.card-mc').addClass('card-mc-selected');

                    $('.btn-maincategory').click(function () {
                        $('.card-mc').removeClass('card-mc-selected');
                        const clickStr = $(this)[0].id;
                        const clickAr = clickStr.split('-');
                        const id = clickAr[1];
                        $('#mc-' + id).find('.card-mc').addClass('card-mc-selected');

                        self.cmbSubCategory(id, (selectedSC) => {
                            self.cmbSub2Category(selectedSC);
                            // self.cmbSub2Category(selectedSC, (selectedS2C) => {
                            //     self.cmbProducts(selectedS2C);
                            // });
                        });

                    });
                }
                if (callback instanceof Function) {
                    callback(selectedMCVal);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="modal" tabIndex="-1" id="billViewer">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header d-print-none">
                                <h5 className="modal-title">Invoice</h5>
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
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary text-white" onClick={window.print}>Print</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* start modal */}
                {/* <div className="modal" id="viewBillModal" tabIndex="-1" >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header d-print-none">
                                <h5 className="modal-title modal-viewstockheading">Invoice</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body px-3 print-invoice">
                                <div className="row">
                                    <div className="col-7">
                                        <h2 className="display-6">Singha Hardware & Industries</h2>
                                        <p>No 812, Colombo Road, 2nd Kurana, Negombo<br />TEL: 077 431 0052 | 077 432 9250</p>
                                    </div>
                                    <div className="col-5 text-end">
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
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary text-white" onClick={window.print}>Print</button>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* end modal */}
                {/* customer add and bill final modal */}
                <div className="modal d-print-none" id="customerModal" show="true" >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title modal-viewstockheading">Manage Customers</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row px-3">
                                    <Customer />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* end of customer add and bill final modal */}
                <div className="row position-absolute h-100 w-100 billing-div d-print-none">
                    <div className="col-lg-3 bg-light py-3 px-2 mc-backgroud">
                        <div className="row row-cols-3 row-cols-md-3 g-2 mainCategory"></div>
                    </div>
                    <div className="col-lg-3 py-3 px-2">
                        <div className="row row-cols-3 row-cols-md-3 g-2 subCategory"></div>
                    </div>
                    <div className="col-lg-2 py-3 px-2">
                        <div className="row row-cols-2 row-cols-md-2 g-2 sub2Category"></div>
                    </div>
                    {/* <div className="col-lg-2 py-3 px-2">
            <div className="row row-cols-1 row-cols-md-2 g-2 productDiv"></div>
        </div> */}
                    <div className="col-lg-4 py-3 px-2 bg-dark px-4 shopping-cart">
                        <div className="row">
                            <div className="col">
                                <table className="table table-hover w-100 carttable text-center">
                                    <thead>
                                        <tr>
                                            <th colSpan="5" className="text-end">
                                                <button onClick={this.emptyCart} className="btn btn-sm btn-danger btn-emptyCart text-white"><FontAwesomeIcon icon="trash-alt" /> Delete All</button>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="table-dark" colSpan="2">Product</th>
                                            <th className="table-dark">Quantity</th>
                                            <th className="table-dark">Unit Price</th>
                                            <th className="table-dark">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                    <tfoot>

                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-end">
                                <form id="frm_cart" className="needs-validation" noValidate>
                                    <div className="mb-3">
                                        <div className="row g-3 align-items-center">
                                            <div className="col-5">
                                                <label htmlFor="pay_amount" className="col-form-label text-white">Pay Amount</label>
                                            </div>
                                            <div className="col-7">
                                                <input type="text" onChange={this.calculateBalanceDue} className="form-control text-end" defaultValue={this.state.payamount} id="pay_amount" pattern="^[0-9]+(\.[0-9]{1,2})?$" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="row g-3 align-items-center">
                                            <div className="col-5">
                                                <label htmlFor="balance_due" className="col-form-label text-white">Balance Due</label>
                                            </div>
                                            <div className="col-7">
                                                <input type="text" className="form-control text-end" id="balance_due" defaultValue={this.state.balanceDue} readOnly required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="row g-3 align-items-center">
                                            <div className="col-5">

                                            </div>
                                            <div className="col-7 text-start">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" value="" id="isCustomerSelect" onClick={this.isCustomerSelect} />
                                                    <label className="form-check-label text-white" htmlFor="isCustomerSelect">
                                                        Add Customer to Bill?</label></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3 customerDiv" hidden>
                                        <div className="row g-3 align-items-center">
                                            <div className="col-5">
                                                <button className="btn btn-outline-success text-white" onClick={this.addNewCustomerModal}>Add New Customer</button>
                                                <label htmlFor="pay_note" className="col-form-label text-white">Or Choose Existing Customer</label>
                                            </div>
                                            <div className="col-7">
                                                <Select className="cmbCustomer" options={this.state.cmbCustomerOptions} value={this.state.selectedCustomerOption} defaultValue={this.state.selectedCustomerOption} onChange={this.onChangeCustomer} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="row g-3 align-items-center">
                                            <div className="col-5">
                                                <label htmlFor="pay_note" className="col-form-label text-white">Bill Note</label>
                                            </div>
                                            <div className="col-7">
                                                <textarea rows="3" id="pay_note" className="form-control" defaultValue="-" required></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button value="1" className="btn btn-success text-white btn-lg" onClick={this.createBill}>Cash</button>
                            <button value="2" className="btn btn-primary text-white btn-lg" onClick={this.createBill}>Cheque</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Billing;