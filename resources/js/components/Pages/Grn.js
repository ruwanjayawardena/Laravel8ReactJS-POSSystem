import React from "react";
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ReactDOM.render(<Stockmodal/>, document.getElementById('modalfunctions'));
// ReactDOM.render(<StockProductTable/>, document.getElementById('StockProductTable'));
class Grn extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            cmbSupplierOptions: [],
            selectedSupplierOption: [],
            //from Stockmodal
            cmbMainCategoryOptions: [],
            selectedMainCatOption: [],
            cmbSubCategoryOptions: [],
            selectedSubCatOption: [],
            cmbSub2CategoryOptions: [],
            selectedSub2CatOption: [],
            cmbProductOptions: [],
            selectedProductOption: [],
            selectbox_disable: false,
            stockArray: []
        };
        //for access this event this keyword need to bind for the function
        this.onChangeSupplier = this.onChangeSupplier.bind(this);
        this.cmbSupplier = this.cmbSupplier.bind(this);
        this.save = this.save.bind(this);
        this.clear = this.clear.bind(this);
        this.edit = this.edit.bind(this);
        this.modalStock = this.modalStock.bind(this);
        this.loadDataTable = this.loadDataTable.bind(this);
        // sessionStorage.removeItem('myarray');
        // From StockProductTable
        this.loadStockTable = this.loadStockTable.bind(this);
        // From Stockmodal
        this.onChangeMainCategory = this.onChangeMainCategory.bind(this);
        this.cmbMainCategory = this.cmbMainCategory.bind(this);
        this.onChangeSubCategory = this.onChangeSubCategory.bind(this);
        this.cmbSubCategory = this.cmbSubCategory.bind(this);
        this.onChangeSub2Category = this.onChangeSub2Category.bind(this);
        this.cmbSub2Category = this.cmbSub2Category.bind(this);
        this.cmbProducts = this.cmbProducts.bind(this);
        this.onChangeProduct = this.onChangeProduct.bind(this);
        this.addStock = this.addStock.bind(this);
    }
    // componentDidUpdate() {
    // }
    componentDidMount() {
        // From Stockmodal        
        this.cmbMainCategory((selectedMC) => {
            this.cmbSubCategory(selectedMC, (selectedSC) => {
                this.cmbSub2Category(selectedSC, (selectedS2C) => {
                    this.cmbProducts(selectedS2C);
                });
            });
        });
        this.cmbSupplier();
        // From StockProductTable
        this.loadStockTable();
        this.loadDataTable();
        // setInterval(()=>{
        //     ReactDOM.render(<StockProductTable/>, document.getElementById('StockProductTable'));
        // }, 1000);      
    }
    
    modalStock(e) {
        e.preventDefault();
        let modal = $('#stockmodal');
        modal.modal('show');
    }
    
    loadStockTable() {
        const self = this;
        // const grnStockArray = localStorage.getItem('grnStockArray');
        // const stockProducts = JSON.parse(localStorage.getItem('myarray'));
        // const stockProducts = JSON.parse(grnStockArray);
        // console.log(stockProducts);
        let tableBody = "";
        let i = 1;
        let total = 0;
        if (parseInt(this.state.stockArray.length) == 0) {
            total = parseFloat(0).toFixed(2);
            tableBody += '<tr>';
            tableBody += '<th class="text-center" colspan="8"> Stock Not Added </td>';
            tableBody += '<tr>';
        } else {
            this.state.stockArray.forEach(function (value, index) {
                total += (parseFloat(value.qty).toFixed(1) * parseFloat(value.stock_price).toFixed(2));
                tableBody += '<tr>';
                tableBody += '<td>' + i + '</td>';
                tableBody += '<td>' + value.product_name + '</td>';
                tableBody += '<td>' + value.qty + '</td>';
                tableBody += '<td>' + value.stock_price + '</td>';
                tableBody += '<td>' + value.selling_price + '</td>';
                tableBody += '<td>' + value.wholesale_price + '</td>';
                tableBody += '<td>' + value.description + '</td>';
                tableBody += '<td><button class="btn btn-danger text-white btn-removeStock" value="' + index + '"><FontAwesomeIcon icon="trash-alt"/> Remove</button></div></td>';
                tableBody += '<tr>';
                i++;
            });
        }
        $('#tblStock tbody').html('').append(tableBody);
        $('.total_amount').html('').append(parseFloat(total).toFixed(2));
        
        $('.btn-removeStock').click(function (e) {
            e.preventDefault();
            const product_index = $(this).val();
            
            // console.log(stockProducts[product_index]);
            self.state.stockArray.splice(product_index, 1);
            // delete stockProducts[product_index];
            Swal.fire({
                title: 'Remove Stock!',
                text: 'Successfull removed selected product stock',
                icon: 'warning',
            });
            self.loadStockTable();
            // console.log("XXXXX" + stockProducts);
            // localStorage.setItem('grnStockArray', JSON.stringify(stockProducts));
            // localStorage.removeItem("grnStockArray");
        });
    }
    
    onChangeSupplier(event) {
        this.setState({ selectedSupplierOption: event });
    }
    
    cmbSupplier(callback) {
        const self = this;
        let selectedVal = null;
        self.setState({ selectedSupplierOption: [] });
        self.setState({ cmbSupplierOptions: [] });
        const url = '/api/cmb/supplier';
        axios.get(url)
        .then(function (response) {
            // handle success             
            const json = response.data;
            let cmbOption;
            const count = Object.keys(json).length;
            if (count == 0) {
                self.setState({ selectedSupplierOption: [] });
                self.setState({ cmbSupplierOptions: [] });
            } else {
                $.each(json, function (index, supplier) {
                    cmbOption = { value: supplier.id, label: supplier.name }
                    if (parseInt(index) == 0) {
                        selectedVal = cmbOption.value;
                        self.setState({ selectedSupplierOption: cmbOption });
                    }
                    self.state.cmbSupplierOptions.push(cmbOption);
                });
            }
            if (callback instanceof Function) {
                callback(selectedVal);
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }
    
    loadDataTable() {
        const self = this;
        const tblurl = '/api/grn/filterdata';
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
                { data: 'description' },
                { data: 'updated_at' },
                {
                    data: "action", render: function (data, type, row) {
                        switch (row.status) {
                            case 0:
                            return '<div class="d-grid gap-2"><button class="btn btn-dark btn-viewStock" value="' + row.id + '-' + row.reference_no + '">View</button><button class="btn btn-danger text-white btn-deleterow" value="' + row.id + '"><FontAwesomeIcon icon="trash-alt"/>Full  Stock Return</button></div>';
                            break;
                            case 1:
                            return '<div class="text-center"><div class="d-grid gap-2 mb-1"><button class="btn btn-dark btn-viewStock" value="' + row.id + '-' + row.reference_no + '">View</button></div><span class="badge bg-danger fs-6 text-center">Fully Returned</span></div>';
                            break;
                            case 2:
                            return '<div class="text-center"><div class="d-grid gap-2 mb-1"><button class="mb-1 btn-block btn btn-dark btn-viewStock" value="' + row.id + '-' + row.reference_no + '">View</button></div><span class="badge bg-warning text-dark fs-6">Partially Returned</span></div>';
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
                            tableBody += '<td>' + value.qty + '</td>';
                            if (value.available_qty_for_return !== null) {
                                tableBody += '<td>' + value.available_qty_for_return + '</td>';
                            } else {
                                tableBody += '<td>' + value.qty + '</td>';
                            }
                            // tableBody += '<td>' + value.available_qty_for_return + '</td>';
                            tableBody += '<td>' + value.stock_price + '</td>';
                            tableBody += '<td>' + value.selling_price + '</td>';
                            tableBody += '<td>' + value.wholesale_price + '</td>';
                            tableBody += '<td>' + value.description + '</td>';
                            //0 -Project Just Created, 1 - Full Returned , 2 - Partial Returned
                            switch (value.status) {
                                case 0:
                                tableBody += '<td><div class="d-grid gap-2"><button class="btn btn-dark btn-stkPartialReturn" value="' + value.id + '-' + index + '">Partial Return</button><button class="btn btn-danger text-white btn-stkFullReturn" value="' + value.id + '"><FontAwesomeIcon icon="trash-alt"/>Full Return</button></div></td>';
                                tableBody += '<tr>';
                                break;
                                case 1:
                                tableBody += '<td class="text-center"><span class="badge bg-danger fs-6 text-center">Fully Returned</span></td>';
                                break;
                                case 2:
                                tableBody += '<td class="text-center"><div class="d-grid gap-2 mb-2"><button class="btn btn-dark btn-stkPartialReturn" value="' + value.id + '-' + index + '">Partial Return</button></div><span class="badge bg-warning text-dark fs-6">Partially Returned</span></td>';
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
                    const url = '/api/grn/stock/' + id;
                    axios.get(url)
                    .then(function (response) {
                        // handle success
                        let jsonStockData = response.data;
                        
                        stockModalTable(jsonStockData, function () {
                            //return partial Stock
                            $('.btn-stkPartialReturn').click(function () {
                                let clickString = $(this).val();
                                let clickAr = clickString.split('-');
                                let max = 0;
                                if (jsonStockData[clickAr[1]]['available_qty_for_return'] !== null) {
                                    max = jsonStockData[clickAr[1]]['available_qty_for_return'];
                                } else {
                                    max = jsonStockData[clickAr[1]]['qty'];
                                }
                                Swal.fire({
                                    title: 'Partially Return from ' + jsonStockData[clickAr[1]]['product_name'],
                                    html:
                                    '<input id="qty2" type="number" min="0" max="' + max + '" class="swal2-input" placeholder="Qty"><input id="return_note" type="text" class="swal2-input" placeholder="Return Note">',
                                    focusConfirm: false,
                                    showCancelButton: true,
                                    confirmButtonText: 'Return',
                                    preConfirm: function () {
                                        return new Promise(function (resolve) {
                                            if (true) {
                                                resolve([
                                                    {
                                                        qty: document.getElementById('qty2').value,
                                                        return_note: document.getElementById('return_note').value
                                                    }
                                                ]);
                                            }
                                        });
                                    }
                                }).then(function (result) {
                                    if (result.isConfirmed) {
                                        const returnFullAjaxParse = {
                                            stockID: clickAr[0],
                                            qty: result.value[0]['qty'],
                                            return_note: result.value[0]['return_note']
                                        }
                                        if (parseFloat(result.value[0]['qty']) <= parseFloat(max)) {
                                            Swal.fire({
                                                title: 'Return Partial Product Stock!',
                                                text: "Are you sure want to return this product partially?",
                                                icon: 'info',
                                                showCancelButton: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    const returnFullURL = '/api/grn/return/partialStock';
                                                    
                                                    axios.post(returnFullURL, returnFullAjaxParse)
                                                    .then(function (response) {
                                                        // handle success
                                                        let jsonData = response.data;
                                                        if (jsonData.msgType == 1) {
                                                            self.loadDataTable();
                                                            Swal.fire({
                                                                title: 'Return Partial Product Stock!',
                                                                text: jsonData.message,
                                                                icon: 'success'
                                                            }).then(function () {
                                                                STKVIEWMODAL.modal('hide');
                                                            });
                                                        } else {
                                                            Swal.fire({
                                                                title: 'Return Partial Product Stock!',
                                                                text: jsonData.message,
                                                                icon: 'warning',
                                                            });
                                                        }
                                                    })
                                                    .catch(function (error) {
                                                        // handle error
                                                        console.log(error);
                                                    });
                                                }
                                            });
                                        } else {
                                            Swal.fire({
                                                title: 'Alert!',
                                                text: 'You allowed Max ' + max + ' Qty for return.',
                                                icon: 'warning',
                                            });
                                        }
                                    }
                                });
                            });
                            
                            //return full Stock
                            $('.btn-stkFullReturn').click(function () {
                                Swal.fire({
                                    title: 'Enter Return Note for this product',
                                    input: 'text',
                                    inputAttributes: {
                                        autocapitalize: 'off'
                                    },
                                    showCancelButton: true,
                                    confirmButtonText: 'Return'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        const returnFullAjaxParse = {
                                            stockID: $(this).val(),
                                            return_note: result.value
                                        }
                                        Swal.fire({
                                            title: 'Return Full Product Stock!',
                                            text: "Are you sure want to return this product fully?",
                                            icon: 'info',
                                            showCancelButton: true
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                const returnFullURL = '/api/grn/return/fullStock';
                                                
                                                axios.post(returnFullURL, returnFullAjaxParse)
                                                .then(function (response) {
                                                    // handle success
                                                    let jsonData = response.data;
                                                    if (jsonData.msgType == 1) {
                                                        
                                                        self.loadDataTable();
                                                        Swal.fire({
                                                            title: 'Return Full Stock!',
                                                            text: jsonData.message,
                                                            icon: 'success'
                                                        }).then(function () {
                                                            STKVIEWMODAL.modal('hide');
                                                        });
                                                    } else {
                                                        Swal.fire({
                                                            title: 'Return Full Stock!',
                                                            text: jsonData.message,
                                                            icon: 'warning',
                                                        });
                                                    }
                                                })
                                                .catch(function (error) {
                                                    // handle error
                                                    console.log(error);
                                                });
                                            }
                                        });
                                    }
                                });
                            });
                        });
                        
                        
                        
                        
                        
                        
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
                });
                
                //delete 
                $('.btn-deleterow').click(function () {
                    Swal.fire({
                        title: 'Enter Return Note',
                        input: 'text',
                        inputAttributes: {
                            autocapitalize: 'off'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Return'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const returnFullAjaxParse = {
                                grn: $(this).val(),
                                return_note: result.value
                            }
                            Swal.fire({
                                title: 'Return Full Stock!',
                                text: "Are you sure want to return fully?",
                                icon: 'info',
                                showCancelButton: true
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const returnFullURL = '/api/grn/return/full';
                                    
                                    axios.post(returnFullURL, returnFullAjaxParse)
                                    .then(function (response) {
                                        // handle success
                                        let jsonData = response.data;
                                        if (jsonData.msgType == 1) {
                                            self.loadDataTable();
                                            Swal.fire({
                                                title: 'Return Full Stock!',
                                                text: jsonData.message,
                                                icon: 'success',
                                            });
                                        } else {
                                            Swal.fire({
                                                title: 'Return Full Stock!',
                                                text: jsonData.message,
                                                icon: 'warning',
                                            });
                                        }
                                    })
                                    .catch(function (error) {
                                        // handle error
                                        console.log(error);
                                    });
                                }
                            });
                        }
                    })
                    // Swal.fire({
                    //     title: 'Delete GRN!',
                    //     text: "Are you sure want to delete this?",
                    //     icon: 'warning',
                    //     showCancelButton: true
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                    //         const id = $(this).val();
                    //         const deleteurl = '/api/grn/' + id;
                    //         axios.delete(deleteurl)
                    //             .then(function (response) {
                    //                 // handle success
                    //                 let jsonData = response.data;
                    //                 self.loadDataTable();
                    //                 Swal.fire({
                    //                     title: 'Delete GRN!',
                    //                     text: jsonData.message,
                    //                     icon: 'warning',
                    //                 });
                    //             })
                    //             .catch(function (error) {
                    //                 // handle error
                    //                 console.log(error);
                    //             });
                    //     }
                    // });
                    
                });
            }
        });
    }
    
    
    save(e) {
        const self = this;
        e.preventDefault();
        const form = document.getElementById('frm');
        //form validation add  
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            const url = '/api/grn';
            
            const grn = {
                reference_no: $('#reference_no').val(),
                description: $('#description').val(),
                supplier: self.state.selectedSupplierOption.value,
                total: parseFloat($('.total_amount').html()).toFixed(2),
                product_stock_array: self.state.stockArray,
            };
            
            axios.post(url, grn)
            .then(function (response) {
                // handle success
                const jsonData = response.data;
                if (jsonData.msgType == 1) {
                    self.setState({ stockArray: [] });
                    self.loadStockTable();
                    Swal.fire({
                        title: 'Save GRN!',
                        text: jsonData.message,
                        icon: 'success',
                    });
                    //form validation remove and clear form after success 
                    self.loadDataTable();
                    form.reset();
                    form.classList.remove('was-validated');
                } else {
                    Swal.fire({
                        title: 'Save GRN!',
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
    }
    
    
    clear(e) {
        const self = this;
        e.preventDefault();
        const form = document.getElementById('frm');
        form.reset();
        self.loadStockTable();
        self.loadDataTable();
        $('.btn-update').prop('hidden', true);
        $('.btn-save').prop('hidden', false);
        form.classList.remove('was-validated');
    }
    
    edit(e) {
        const self = this;
        e.preventDefault();
        const form = document.getElementById('frm');
        //form validation add  
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            Swal.fire({
                title: 'Update GRN!',
                text: "Do you want to update this?",
                icon: 'warning',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = $('#id').val();
                    const url = '/api/grn/' + id;
                    const grn = {
                        reference_no: $('#reference_no').val(),
                        description: $('#description').val(),
                        supplier: self.selectedSupplierOption.value,
                        total: parseFloat($('.total_amount').html()).toFixed(2),
                        product_stock_array: self.state.stockArray,
                    };
                    axios.put(url, grn)
                    .then(function (response) {
                        // handle success
                        const jsonData = response.data;
                        if (jsonData.msgType == 1) {
                            self.loadDataTable();
                            Swal.fire({
                                title: 'Update GRN!',
                                text: jsonData.message,
                                icon: 'success',
                            });
                            //form validation remove and clear form after success                              
                            form.reset();
                            $('.btn-update').prop('hidden', true);
                            $('.btn-save').prop('hidden', false);
                            form.classList.remove('was-validated');
                        } else {
                            Swal.fire({
                                title: 'Update GRN!',
                                text: jsonData.message,
                                icon: 'warning',
                            });
                        }
                    })
                    .catch(function (error) {
                        // handle error
                        console.log("Error: " + error.response);
                    });
                }
            });
        }
        
    }
    
    
    //From Stockmodal
    addStock(e) {
        // const self = this;
        e.preventDefault();
        const form = document.getElementById('modal_frm');
        //form validation add  
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            const stock = {
                product: this.state.selectedProductOption.value,
                product_name: this.state.selectedProductOption.label,
                qty: parseFloat($('#qty').val()).toFixed(1),
                selling_price: parseFloat($('#selling_price').val()).toFixed(2),
                stock_price: parseFloat($('#stock_price').val()).toFixed(2),
                wholesale_price: parseFloat($('#wholesale_price').val()).toFixed(2),
                description: $('#modal_description').val()
            };
            if (this.state.selectedProductOption.value !== undefined) {
                if (parseInt(this.state.stockArray.length) == 0) {
                    this.state.stockArray.push(stock);
                } else {
                    //check if product available right now
                    this.state.stockArray.forEach((value, index) => {
                        if (parseInt(value.product) == parseInt(this.state.selectedProductOption.value)) {
                            this.state.stockArray.splice(index, 1);
                        }
                    });
                    this.state.stockArray.push(stock);
                }
                Swal.fire({
                    title: 'Add Stock!',
                    text: 'Successfully product stock added.',
                    icon: 'success',
                });
                form.reset();
                form.classList.remove('was-validated');
                this.loadStockTable();
            } else {
                Swal.fire({
                    title: 'Add Stock!',
                    text: 'Please select available product for add stock',
                    icon: 'warning',
                });
            }
            // localStorage.setItem('grnStockArray', JSON.stringify(this.state.stockArray));
        }
    }
    
    
    onChangeMainCategory(event) {
        this.setState({ selectedMainCatOption: event });
        this.cmbSubCategory(event.value, (selectedSC) => {
            this.cmbSub2Category(selectedSC, (selectedS2C) => {
                this.cmbProducts(selectedS2C);
            });
        });
    }
    
    onChangeSubCategory(event) {
        this.setState({ selectedSubCatOption: event });
        this.cmbSub2Category(event.value, (selectedS2C) => {
            this.cmbProducts(selectedS2C);
        });
    }
    
    onChangeSub2Category(event) {
        this.setState({ selectedSub2CatOption: event });
        this.cmbProducts(event.value);
    }
    
    onChangeProduct(event) {
        this.setState({ selectedProductOption: event });
        
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
                $.each(json, function (index, maincategory) {
                    templabel = maincategory.code + '-' + maincategory.category;
                    cmbOption = { value: maincategory.id, label: templabel, code: maincategory.code }
                    if (parseInt(index) == 0) {
                        selectedMCVal = cmbOption.value;
                        self.setState({ selectedMainCatOption: cmbOption });
                    }
                    self.state.cmbMainCategoryOptions.push(cmbOption);
                    // console.log(self.state.cmbMainCategoryOptions);
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
    
    cmbSubCategory(maincategory, callback) {
        const self = this;
        let selectedSCVal = null;
        //array  cleared
        self.setState({ selectedSubCatOption: [] });
        self.setState({ cmbSubCategoryOptions: [] });
        const url = '/api/cmb/sub1categories/' + maincategory;
        axios.get(url)
        .then(function (response) {
            // handle success             
            const json = response.data;
            let cmbOption;
            const count = Object.keys(json).length;
            if (count == 0) {
                self.setState({ selectedSubCatOption: [] });
                self.setState({ cmbSubCategoryOptions: [] });
            } else {
                $.each(json, function (index, qData) {
                    cmbOption = { value: qData.id, label: qData.subcategory }
                    if (parseInt(index) == 0) {
                        selectedSCVal = cmbOption.value;
                        self.setState({ selectedSubCatOption: cmbOption });
                    }
                    self.state.cmbSubCategoryOptions.push(cmbOption);
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
    
    cmbSub2Category(subcategory, callback) {
        const self = this;
        let selectedS2CVal = null;
        //array  cleared
        self.setState({ selectedSub2CatOption: [] });
        self.setState({ cmbSub2CategoryOptions: [] });
        const url = '/api/cmb/sub2categories/' + subcategory;
        axios.get(url)
        .then(function (response) {
            // handle success             
            const json = response.data;
            let cmbOption;
            const count = Object.keys(json).length;
            if (count == 0) {
                self.setState({ selectedSub2CatOption: [] });
                self.setState({ cmbSub2CategoryOptions: [] });
            } else {
                $.each(json, function (index, qData) {
                    cmbOption = { value: qData.id, label: qData.sub2category }
                    if (parseInt(index) == 0) {
                        selectedS2CVal = cmbOption.value;
                        self.setState({ selectedSub2CatOption: cmbOption });
                    }
                    self.state.cmbSub2CategoryOptions.push(cmbOption);
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
    
    cmbProducts(sub2category, callback) {
        const self = this;
        let selectedProductVal = null;
        //array  cleared
        self.setState({ selectedProductOption: [] });
        self.setState({ cmbProductOptions: [] });
        const url = '/api/cmb/products/' + sub2category;
        axios.get(url)
        .then(function (response) {
            // handle success             
            const json = response.data;
            let cmbOption;
            const count = Object.keys(json).length;
            if (count == 0) {
                self.setState({ selectedProductOption: [] });
                self.setState({ cmbProductOptions: [] });
            } else {
                $.each(json, function (index, qData) {
                    cmbOption = { value: qData.id, label: qData.product }
                    if (parseInt(index) == 0) {
                        selectedProductVal = cmbOption.value;
                        self.setState({ selectedProductOption: cmbOption });
                    }
                    self.state.cmbProductOptions.push(cmbOption);
                });
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
    
    render() {
        return (
            <div className="container py-5 px-2">
            <div className="modal" id="stockmodal" show="true" >
            <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title">Add Stock</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            {/* modal body */}
            <div className="row">
            <div className="col-12 col">
            <form id="modal_frm" className="needs-validation" noValidate>
            <div className="mb-3">
            <Select className="cmbMainCategory" isDisabled={this.state.selectbox_disable} options={this.state.cmbMainCategoryOptions} value={this.state.selectedMainCatOption} defaultValue={this.state.selectedMainCatOption} onChange={this.onChangeMainCategory} />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="mb-3">
            <Select className="cmbSubCategory" isDisabled={this.state.selectbox_disable} options={this.state.cmbSubCategoryOptions} value={this.state.selectedSubCatOption} defaultValue={this.state.selectedSubCatOption} onChange={this.onChangeSubCategory} />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="mb-3">
            <Select className="cmbSub2Category" isDisabled={this.state.selectbox_disable} options={this.state.cmbSub2CategoryOptions} value={this.state.selectedSub2CatOption} defaultValue={this.state.selectedSub2CatOption} onChange={this.onChangeSub2Category} />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="mb-3">
            <Select className="cmbProducts" isDisabled={this.state.selectbox_disable} options={this.state.cmbProductOptions} value={this.state.selectedProductOption} defaultValue={this.state.selectedProductOption} onChange={this.onChangeProduct} />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="qty" pattern="^[0-9]+(\.[0-9]{1})?$" autoComplete="off" required />
            <label htmlFor="qty">Qty</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required & Qty Number Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="stock_price" pattern="^[0-9]+(\.[0-9]{1,2})?$" autoComplete="off" required />
            <label htmlFor="stock_price">Stock Price</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required & Currency Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="selling_price" pattern="^[0-9]+(\.[0-9]{1,2})?$" autoComplete="off" required />
            <label htmlFor="selling_price">Selling Price</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required & Currency Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="wholesale_price" pattern="^[0-9]+(\.[0-9]{1,2})?$" autoComplete="off" required />
            <label htmlFor="wholesale_price">Wholesale Price</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required & Currency Field.</div>
            </div>
            <div className="form-floating mb-3">
            <textarea className="form-control" id="modal_description" autoComplete="off" rows="5" defaultValue="-" required></textarea>
            <label htmlFor="modal_description">Description</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            </form>
            </div>
            </div>
            {/* modal body end */}
            </div>
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-success text-white" id="btn-stockadd" onClick={this.addStock}>
            <FontAwesomeIcon icon="save" /> Add
            </button>
            </div>
            </div>
            </div>
            </div>
            {/* view modal */}
            <div className="modal" id="stockViewmodal" show="true" >
            <div className="modal-dialog modal-xl">
            <div className="modal-content">
            <div className="modal-header">
            <h5 className="modal-title modal-viewstockheading">Stocked Items</h5>
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
            <th scope="col">Returned Allowed Qty</th>
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
            <h3 className="display-6"><FontAwesomeIcon icon="truck-loading" /> (GRN) Good Receive Note & Returning</h3>
            <p className="lead text-muted fs-6 mb-4">All stock receive and return handling </p>
            <div className="col-12 col-md-5">
            <form id="frm" className="needs-validation" noValidate>
            <input type="hidden" id="id" />
            <div className="mb-3">
            <Select className="cmbSupplier" options={this.state.cmbSupplierOptions} value={this.state.selectedSupplierOption} defaultValue={this.state.selectedSupplierOption} onChange={this.onChangeSupplier} />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="reference_no" pattern="^(\d|\w|-)+$" autoComplete="off" required />
            <label htmlFor="name">Reference No</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required | Spaces not allowed.</div>
            </div>
            <div className="form-floating mb-3">
            <textarea className="form-control" id="description" autoComplete="off" rows="5" defaultValue="-" required></textarea>
            <label htmlFor="sub2category">Description</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="mb-3">
            <button className="btn btn-primary text-white btn-stock" onClick={this.modalStock}>Add Products</button>
            </div>
            <div className="mb-3">
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
            </div>
            <div className="mb-3">
            <h4>Total: <span className="badge bg-dark total_amount">0.00</span></h4>
            </div>
            <div className="py-2 d-grid gap-2 d-md-block">
            <button type="button" className="btn btn-success text-white btn-save" onClick={this.save}>
            <FontAwesomeIcon icon="save" /> Add
            </button>
            <button type="button" className="btn ms-1 btn-warning btn-update" onClick={this.edit} hidden>
            <FontAwesomeIcon icon="edit" />  Update
            </button>
            <button type="button" className="btn ms-1 btn-secondary btn-clear" onClick={this.clear}>
            <FontAwesomeIcon icon="redo-alt" /> Clear
            </button>
            </div>
            </form>
            </div>
            <div className="col-12 col-md-7">
            <table id="tbl" className="table table-hover table-responsive table-bordered">
            <thead className="table-dark">
            <tr>
            <th scope="col">#</th>
            <th scope="col">GRN Reference</th>
            <th scope="col">Supplier</th>
            <th scope="col">Total</th>
            <th scope="col">Description</th>
            <th scope="col">Last Updated On</th>
            <th scope="col">Action</th>
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
    
    export default Grn;