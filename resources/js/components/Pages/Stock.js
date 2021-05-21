import React from "react";
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Stock extends React.Component {
    
    
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
            cmbStatusOptions: [],
            selectedStatusOption: [],
            selectbox_disable: false
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
        this.cmbStatus = this.cmbStatus.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.loadDataTable = this.loadDataTable.bind(this);
        this.save = this.save.bind(this);
        this.clear = this.clear.bind(this);
        this.edit = this.edit.bind(this);
    }
    
    componentDidMount() {
        this.cmbStatus();
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
    
    onChangeStatus(event) {
        this.setState({ selectedStatusOption: event });
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
    
    cmbStatus() {
        //const self = this;              
        // handle success        
        const cmbOption = [
            { value: 1, label: 'Add Stock' },
            { value: 0, label: 'Remove Stock'},
        ]
        this.setState({cmbStatusOptions:cmbOption});
        this.setState({selectedStatusOption:{value: 1, label: 'Add Stock'}});
        // self.state.cmbStatusOptions.push(cmbOption);
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
    
    loadDataTable(product_id) {
        const self = this;
        if (product_id == 'undefined' || product_id == null) {
            product_id = self.state.selectedProductOption.value
        }
        const tblurl = '/api/stock/filterdata';
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
                { data: 'qty' },
                { data: 'price' },
                { data: 'wholesale_price' },
                { data: 'description' },
                {
                    data: "stock_status", render: function (data, type, row) {
                        let stock_status = "";
                        if (parseInt(row.status) == 1) {
                            stock_status = 'Added Stock';
                        } else {
                            stock_status = 'Removed Stock';
                        }
                        return stock_status;
                    }
                },
                { data: 'updated_at' },
                {
                    data: "action", render: function (data, type, row) {
                        return '<div class="d-grid gap-2"><button class="btn btn-dark btn-editrow" value="' + row.id + '">Edit</button><button class="btn btn-danger text-white btn-deleterow" value="' + row.id + '"><FontAwesomeIcon icon="trash-alt"/> Delete</button></div>';
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
                //load editable data into leftside form
                $('.btn-editrow').click(function () {
                    $('.btn-update').prop('hidden', false);
                    $('.btn-save').prop('hidden', true);
                    const id = $(this).val();
                    const editurl = '/api/stock/' + id;
                    axios.get(editurl)
                    .then(function (response) {
                        // handle success
                        let jsonData = response.data;
                        $.each(jsonData, function (index, qData) {
                            $('#qty').val(qData.qty);
                            $('#price').val(qData.price);
                            $('#wholesale_price').val(qData.wholesale_price);
                            $('#description').val(qData.description);
                            $('#id').val(qData.id);
                        });
                        self.setState({ selectbox_disable: true });
                        
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
                });
                
                //delete 
                $('.btn-deleterow').click(function () {
                    Swal.fire({
                        title: 'Delete Stock!',
                        text: "Are you sure want to delete this?",
                        icon: 'warning',
                        showCancelButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const id = $(this).val();
                            const deleteurl = '/api/stock/' + id;
                            axios.delete(deleteurl)
                            .then(function (response) {
                                // handle success
                                let jsonData = response.data;
                                self.loadDataTable();
                                Swal.fire({
                                    title: 'Delete Stock!',
                                    text: jsonData.message,
                                    icon: 'warning',
                                });
                            })
                            .catch(function (error) {
                                // handle error
                                console.log(error);
                            });
                        }
                    });
                    
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
            const url = '/api/stock';
            
            const stock = {
                product: self.state.selectedProductOption.value,
                qty: $('#qty').val(),
                price: $('#price').val(),
                wholesale_price: $('#wholesale_price').val(),
                description: $('#description').val()
            };
            
            axios.post(url, stock)
            .then(function (response) {
                // handle success
                const jsonData = response.data;
                if (jsonData.msgType == 1) {
                    self.loadDataTable();
                    Swal.fire({
                        title: 'Save Product!',
                        text: jsonData.message,
                        icon: 'success',
                    });
                    //form validation remove and clear form after success                              
                    form.reset();
                    form.classList.remove('was-validated');
                } else {
                    Swal.fire({
                        title: 'Save Product!',
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
                title: 'Update Stock!',
                text: "Do you want to update this?",
                icon: 'warning',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = $('#id').val();
                    const url = '/api/stock/' + id;
                    const stock = {
                        qty: $('#qty').val(),
                        price: $('#price').val(),
                        wholesale_price: $('#wholesale_price').val(),
                        description: $('#description').val()
                    };
                    axios.put(url, stock)
                    .then(function (response) {
                        // handle success
                        const jsonData = response.data;
                        if (jsonData.msgType == 1) {
                            self.loadDataTable();
                            self.setState({ selectbox_disable: false });
                            Swal.fire({
                                title: 'Update Stock!',
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
                                title: 'Update Stock!',
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
    
    render() {
        return (
            <div className="container py-5 px-2">
            <div className="row">
            <h3 className="display-6"><FontAwesomeIcon icon="sitemap" /> Stock</h3>
            <p className="lead text-muted fs-6 mb-4">Add or Remove Product Stock</p>
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
            <div className="mb-3">
            <Select className="cmbStatus" isDisabled={this.state.selectbox_disable} options={this.state.cmbStatusOptions} value={this.state.selectedStatusOption} defaultValue={this.state.selectedStatusOption} onChange={this.onChangeStatus} />
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="qty" autoComplete="off" required />
            <label htmlFor="sub2category">Qty</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="price" autoComplete="off" required />
            <label htmlFor="sub2category">Selling Price</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="wholesale_price" autoComplete="off" required />
            <label htmlFor="sub2category">Wholesale Price</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <textarea className="form-control" id="description" autoComplete="off" rows="5" defaultValue="-" required></textarea>
            <label htmlFor="sub2category">Description</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
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
            <th scope="col">Qty</th>
            <th scope="col">Price</th>
            <th scope="col">Wholesale Price</th>
            <th scope="col">Description</th>
            <th scope="col">Status</th>
            <th scope="col">Last Updated On</th>
            <th scope="col">Action</th>
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
    
    export default Stock;