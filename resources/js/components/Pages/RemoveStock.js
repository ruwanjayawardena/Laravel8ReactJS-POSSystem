import React from "react";
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class RemoveStock extends React.Component {
    
    
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
            selectbox_disable: false,
        };
        
        //for access this event this keyword need to bind for the function
        this.onChangeMainCategory = this.onChangeMainCategory.bind(this);
        this.cmbMainCategory = this.cmbMainCategory.bind(this);
        this.onChangeSubCategory = this.onChangeSubCategory.bind(this);
        this.cmbSubCategory = this.cmbSubCategory.bind(this);
        this.onChangeSub2Category = this.onChangeSub2Category.bind(this);
        this.cmbSub2Category = this.cmbSub2Category.bind(this);
        this.cmbProducts = this.cmbProducts.bind(this);
        this.onChangeProduct = this.onChangeProduct.bind(this);
        this.loadDataTable = this.loadDataTable.bind(this);
        this.save = this.save.bind(this);
        this.clear = this.clear.bind(this);
        this.getMaxQty = this.getMaxQty.bind(this);
    }
    
    componentDidMount() {
        this.cmbMainCategory((selectedMC) => {
            this.cmbSubCategory(selectedMC, (selectedSC) => {
                this.cmbSub2Category(selectedSC, (selectedS2C) => {
                    this.cmbProducts(selectedS2C, (selectedProduct) => {
                        this.loadDataTable(selectedProduct);
                    });
                });
            });
        });
    }
    
    getMaxQty() {
        const max = this.state.selectedProductOption['qty'];
        return max;
    }
    
    onChangeMainCategory(event) {
        this.setState({ selectedMainCatOption: event });
        this.cmbSubCategory(event.value, (selectedSC) => {
            this.cmbSub2Category(selectedSC, (selectedS2C) => {
                this.cmbProducts(selectedS2C, (selectedProduct) => {
                    this.loadDataTable(selectedProduct);
                });
            });
        });
    }
    
    onChangeSubCategory(event) {
        this.setState({ selectedSubCatOption: event });
        this.cmbSub2Category(event.value, (selectedS2C) => {
            this.cmbProducts(selectedS2C, (selectedProduct) => {
                this.loadDataTable(selectedProduct);
            });
        });
    }
    
    onChangeSub2Category(event) {
        this.setState({ selectedSub2CatOption: event });
        this.cmbProducts(event.value, (selectedProduct) => {
            this.loadDataTable(selectedProduct);
        });
    }
    
    onChangeProduct(event) {
        this.setState({ selectedProductOption: event });
        this.loadDataTable(event.value);
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
                    cmbOption = { value: qData.id, label: qData.product, qty: qData.qty }
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
    
    loadDataTable(product_id) {
        const self = this;
        if (product_id == 'undefined' || product_id == null) {
            product_id = self.state.selectedProductOption.value
        }
        const tblurl = '/api/removestock/filterdata';
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
                'data': {
                    "product": product_id
                }
            },
            columns: [
                { data: 'id' },
                { data: 'product_code' },
                { data: 'product_name' },
                { data: 'product_qty' },
                { data: 'qty' },
                { data: 'remove_note' },
                { data: 'updated_at' }
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
            const url = '/api/removestock';
            const pqty = $('#qty').val();
            
            const removestock = {
                product: self.state.selectedProductOption.value,
                qty: pqty,
                remove_note: $('#remove_note').val()
            };

            if ((parseFloat(pqty) <= parseFloat(self.state.selectedProductOption['qty'])) && (parseFloat(pqty) >0)) {
                axios.post(url, removestock)
                .then(function (response) {
                    // handle success
                    const jsonData = response.data;
                    if (jsonData.msgType == 1) {
                        // self.loadDataTable();
                        Swal.fire({
                            title: 'Remove Stock!',
                            text: jsonData.message,
                            icon: 'success',
                        });
                        //form validation remove and clear form after success  
                        self.cmbMainCategory((selectedMC) => {
                            self.cmbSubCategory(selectedMC, (selectedSC) => {
                                self.cmbSub2Category(selectedSC, (selectedS2C) => {
                                    self.cmbProducts(selectedS2C, (selectedProduct) => {
                                        self.loadDataTable(selectedProduct);
                                    });
                                });
                            });
                        });                            
                        form.reset();
                        form.classList.remove('was-validated');
                    } else {
                        Swal.fire({
                            title: 'Remove Stock!',
                            text: jsonData.message,
                            icon: 'warning',
                        });
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log("Error: " + error.response);
                });
            } else {
                Swal.fire({
                    title: 'Remove Stock!',
                    text: 'You entered qty not less than 0 and not less than available qty.choose selected and you can find what is max qty',
                    icon: 'warning',
                });
            }
            
            
        }
    }
    
    
    clear(e) {
        const self = this;
        e.preventDefault();
        const form = document.getElementById('frm');
        form.reset();
        self.loadDataTable();
        $('.btn-update').prop('hidden', true);
        $('.btn-save').prop('hidden', false);
        form.classList.remove('was-validated');
        self.setState({ selectbox_disable: false });
    }
    
    
    render() {
        return (
            <div className="container py-5 px-2">
            <div className="row">
            <h3 className="display-6"><FontAwesomeIcon icon="trash" /> Remove Stock</h3>
            <p className="lead text-muted fs-6 mb-4">Remove Product Stocks</p>
            <div className="col-12 col-md-5">
            <form id="frm" className="needs-validation" noValidate>
            <input type="hidden" id="id" />
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
            <input type="number" className="form-control" min="0" max={this.getMaxQty()} id="qty" autoComplete="off" required />
            <label htmlFor="qty">Qty</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <textarea className="form-control" id="remove_note" colSpan="5" autoComplete="off" required></textarea>
            <label htmlFor="remove_note">Remove Note</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="py-2 d-grid gap-2 d-md-block">
            <button type="button" className="btn btn-success text-white btn-save" onClick={this.save}>
            <FontAwesomeIcon icon="save" /> Remove
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
            <th scope="col">Product Code</th>
            <th scope="col">Product</th>
            <th scope="col">Available Qty</th>
            <th scope="col">Removed Qty</th>
            <th scope="col">Note</th>
            <th scope="col">Last Updated On</th>
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
    
    export default RemoveStock;