import React from "react";
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Product extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            cmbMainCategoryOptions: [],
            selectedMainCatOption: [],
            cmbSubCategoryOptions: [],
            selectedSubCatOption: [],
            cmbSub2CategoryOptions: [],
            selectedSub2CatOption: [],
            selectbox_disable: false,
            selectedFile: null,
            previewImage: null
        };

        //for access this event this keyword need to bind for the function
        this.onChangeMainCategory = this.onChangeMainCategory.bind(this);
        this.cmbMainCategory = this.cmbMainCategory.bind(this);
        this.onChangeSubCategory = this.onChangeSubCategory.bind(this);
        this.cmbSubCategory = this.cmbSubCategory.bind(this);
        this.onChangeSub2Category = this.onChangeSub2Category.bind(this);
        this.cmbSub2Category = this.cmbSub2Category.bind(this);
        this.loadDataTable = this.loadDataTable.bind(this);
        this.save = this.save.bind(this);
        this.clear = this.clear.bind(this);
        this.edit = this.edit.bind(this);
        this.generateProductCode = this.generateProductCode.bind(this);
        this.uploadHandler = this.uploadHandler.bind(this);
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
        this.updateProductImage = this.updateProductImage.bind(this);
    }

    //update product image
    updateProductImage(e) {
        e.preventDefault();
        self = this;
        if (self.state.selectedFile !== null) {
            const id = $('#id').val();
            const formData = new FormData();
            formData.append('product_image', self.state.selectedFile, self.state.selectedFile.name);
            formData.append('id', id);
            const url = './api/products/updateProductImage'
            axios.post(url, formData)
                .then(function (response) {
                    // handle success
                    const jsonData = response.data;
                    if (jsonData.msgType == 1) {
                        $('.image-div').prop('hidden', true);
                        $('.btn-updateImage').prop('hidden', true);
                        self.setState({ selectedFile: null });
                        self.setState({ previewImage: null });
                        Swal.fire({
                            title: 'Update Product Image!',
                            text: jsonData.message,
                            icon: 'success',
                        });
                    } else {
                        Swal.fire({
                            title: 'Update Product Image!',
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
                title: 'Update Product Image!',
                text: 'Please choose an image for upload.',
                icon: 'warning',
            });
        }

    }

    //file upload
    fileChangedHandler(event) {
        this.setState({ selectedFile: event.target.files[0] })
        const file = URL.createObjectURL(event.target.files[0]);
        this.setState({ previewImage: file });
        if ($('.image-div').is(':hidden')) {
            $('.image-div').prop('hidden', false);
        }
    }

    uploadHandler(e) {
        e.preventDefault();
        console.log(this.state.selectedFile);
        const formData = new FormData();
        formData.append(
            'myFile',
            this.state.selectedFile,
            this.state.selectedFile.name
        )
        axios.post('./api/products/uploadProductImage', formData, {
            onUploadProgress: progressEvent => {
                console.log(progressEvent.loaded / progressEvent.total)
            }
        });
    }

    generateProductCode(sub1_id, sub2_id) {
        if (sub1_id === undefined || sub1_id === null) {
            sub1_id = this.state.selectedSubCatOption.value;
        }
        if (sub2_id === undefined || sub2_id === null) {
            sub2_id = this.state.selectedSub2CatOption.value;
        }
        const maincode = this.state.selectedMainCatOption.code;
        let product_code = "";
        const url = '/api/products/getNextProductID';
        axios.get(url)
            .then(function (response) {
                // handle success            
                const productID = response.data;
                if (maincode === undefined || sub1_id === undefined || sub2_id === undefined || productID === undefined) {
                    product_code = "No Product Code";
                } else {
                    product_code = maincode + sub1_id + sub2_id + '-' + productID;
                }
                $('#product_code').val(product_code);
            });

    }

    componentDidMount() {
        this.cmbMainCategory((selectedMC) => {
            this.cmbSubCategory(selectedMC, (selectedSC) => {
                this.cmbSub2Category(selectedSC, (selectedS2C) => {
                    this.loadDataTable(selectedS2C);
                    this.generateProductCode();
                });
            });
        });
    }

    onChangeMainCategory(event) {
        this.setState({ selectedMainCatOption: event });
        this.cmbSubCategory(event.value, (selectedSC) => {
            this.cmbSub2Category(selectedSC, (selectedS2C) => {
                this.loadDataTable(selectedS2C);
                this.generateProductCode(selectedSC);
            });
        });
    }

    onChangeSubCategory(event) {
        this.setState({ selectedSubCatOption: event });
        this.cmbSub2Category(event.value, (selectedS2C) => {
            this.loadDataTable(selectedS2C);
            this.generateProductCode(event.value, selectedS2C);
        });
    }

    onChangeSub2Category(event) {
        this.setState({ selectedSub2CatOption: event });
        this.loadDataTable(event.value);
        this.generateProductCode(null, event.value);
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
                        // templabel = maincategory.category;
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

    loadDataTable(sub2category_id) {
        const self = this;
        if (sub2category_id == 'undefined' || sub2category_id == null) {
            sub2category_id = self.state.selectedSub2CatOption.value
        }
        const tblurl = '/api/products/filterdata';
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
                    "sub2category": sub2category_id
                }
            },
            columns: [
                { data: 'id' },
                { data: 'product_code' },
                { data: 'product' },
                { data: 'qty' },
                { data: 'price' },
                { data: 'wholesale_price' },
                { data: 'last_sold_price' },
                { data: 'description' },
                { data: 'updated_at' },
                {
                    data: "action", render: function (data, type, row) {
                        return '<div class="d-grid gap-2"><button class="btn btn-secondary btn-updateprices" value="' + row.id + '-' + row.product_code + '">Update Selling/Wholesale Prices</button></div>';
                        // return '<div class="d-grid gap-2"><button class="btn btn-dark btn-updateprices" value="' + row.id + '-'+row.product_code+'">Update Selling/Wholesale Prices</button><button class="btn btn-dark btn-editrow" value="' + row.id + '">Edit</button><button class="btn btn-danger text-white btn-deleterow" value="' + row.id + '"><FontAwesomeIcon icon="trash-alt"/> Delete</button></div>';
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
                $('.btn-updateprices').click(function () {
                    const clickString = $(this).val();
                    const clickAr = clickString.split('-');
                    Swal.fire({
                        title: 'Update Selling & Wholesale Prices of ' + clickAr[1],
                        html:
                            '<input id="price" type="text" class="swal2-input" placeholder="Selling Price">' +
                            '<input id="wholesale_price" type="text" class="swal2-input" placeholder="Wholesale Price">',
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: 'Update',
                        preConfirm: function () {
                            return new Promise(function (resolve) {
                                if (true) {
                                    resolve([
                                        {
                                            price: document.getElementById('price').value,
                                            wholesale_price: document.getElementById('wholesale_price').value
                                        }
                                    ]);
                                }
                            });
                        }
                    }).then(function (result) {
                        if (result.isConfirmed) {
                            const returnFullAjaxParse = {
                                id: clickAr[0],
                                price: result.value[0]['price'],
                                wholesale_price: result.value[0]['wholesale_price']
                            }
                            Swal.fire({
                                title: 'Update Selling & Wholesale Prices of ' + clickAr[1],
                                text: "Are you sure want to update this product prices?",
                                icon: 'info',
                                showCancelButton: true
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    const returnFullURL = '/api/products/pricesupdate';

                                    axios.post(returnFullURL, returnFullAjaxParse)
                                        .then(function (response) {
                                            // handle success
                                            let jsonData = response.data;
                                            if (jsonData.msgType == 1) {
                                                self.loadDataTable();
                                                Swal.fire({
                                                    title: 'Product Prices Update!',
                                                    text: jsonData.message,
                                                    icon: 'success'
                                                });
                                            } else {
                                                Swal.fire({
                                                    title: 'Product Prices Update!',
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

                $('.btn-editrow').click(function () {
                    $('.btn-update').prop('hidden', false);
                    $('.btn-save').prop('hidden', true);
                    const id = $(this).val();
                    const editurl = '/api/products/' + id;
                    axios.get(editurl)
                        .then(function (response) {
                            // handle success
                            let jsonData = response.data;
                            $.each(jsonData, function (index, qData) {
                                $('#product_code').val(qData.product_code);
                                $('.image-div').prop('hidden', false);
                                $('.btn-updateImage').prop('hidden', false);
                                if (qData.product_image !== null) {
                                    const img_path = './storage/products/' + qData.product_image;
                                    self.setState({ previewImage: img_path });
                                } else {
                                    const img_path = './img/no_image.jpg';
                                    self.setState({ previewImage: img_path });
                                }
                                $('#product').val(qData.product);
                                // $('#qty').val(qData.qty);                                
                                // $('#price').val(qData.price);                                
                                // $('#wholesale_price').val(qData.wholesale_price);                                
                                // $('#last_sold_price').val(qData.last_sold_price);                                
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
                        title: 'Delete Product!',
                        text: "Are you sure want to delete this?",
                        icon: 'warning',
                        showCancelButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const id = $(this).val();
                            const deleteurl = '/api/products/' + id;
                            axios.delete(deleteurl)
                                .then(function (response) {
                                    // handle success
                                    let jsonData = response.data;
                                    self.loadDataTable();
                                    self.generateProductCode();
                                    Swal.fire({
                                        title: 'Delete Product!',
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
        // console.log(self.state.selectedFile); 
        const form = document.getElementById('frm');
        //form validation add  
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            const url = '/api/products';

            const formData = new FormData();
            if (this.state.selectedFile !== null) {
                formData.append('product_image', this.state.selectedFile, this.state.selectedFile.name);
            }
            formData.append('maincategory', self.state.selectedMainCatOption.value);
            formData.append('sub1category', self.state.selectedSubCatOption.value);
            formData.append('sub2category', self.state.selectedSub2CatOption.value);
            formData.append('product_code', $('#product_code').val());
            formData.append('product', $('#product').val());
            formData.append('description', $('#description').val());

            axios.post(url, formData)
                .then(function (response) {
                    // handle success
                    const jsonData = response.data;
                    if (jsonData.msgType == 1) {
                        self.loadDataTable();
                        self.generateProductCode();
                        $('.image-div').prop('hidden', true);
                        self.setState({ selectedFile: null });
                        self.setState({ previewImage: null });
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
        self.generateProductCode();
        self.setState({ selectedFile: null });
        self.setState({ previewImage: null });
        $('.image-div').prop('hidden', true);
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
                title: 'Update Product!',
                text: "Do you want to update this?",
                icon: 'warning',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = $('#id').val();
                    const url = '/api/products/' + id;
                    const category = {
                        product: $('#product').val(),
                        description: $('#description').val()
                    };
                    axios.put(url, category)
                        .then(function (response) {
                            // handle success
                            const jsonData = response.data;
                            if (jsonData.msgType == 1) {
                                self.loadDataTable();
                                self.generateProductCode();
                                $('.image-div').prop('hidden', true);
                                self.setState({ selectbox_disable: false });
                                self.setState({ selectedFile: null });
                                self.setState({ previewImage: null });
                                Swal.fire({
                                    title: 'Update Product!',
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
                                    title: 'Update Product!',
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
                    <h3 className="display-6"><FontAwesomeIcon icon="box-open" /> Stock</h3>
                    <p className="lead text-muted fs-6 mb-4">View information about item vice stocks & You allowed to update prices</p>
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
                            {/* <div className="mb-3 image-div" hidden>
                                <div className="row">
                                    <div className="col">
                                        <img className="img-fluid img-thumbnail img-product-thumbnail" src={this.state.previewImage} />
                                    </div>
                                    <div className="col">
                                        <button type="button" className="btn ms-1 btn-warning btn-updateImage" onClick={this.updateProductImage} hidden>
                                            <FontAwesomeIcon icon="upload" /> Update Image </button>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="mb-3">
                                <label htmlFor="product_image" className="form-label">Product Image</label>
                                <input className="form-control" type="file" id="product_image" onChange={this.fileChangedHandler} />
                                
                            </div> */}
                            {/* <div className="form-floating mb-3">
                                <input type="text" className="form-control text-dark fw-bold" id="product_code" autoComplete="off" readOnly required />
                                <label htmlFor="sub2category">Product Code</label>
                                <div className="valid-feedback">Looks good!</div>
                                <div className="invalid-feedback">Required Field.</div>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="product" autoComplete="off" required />
                                <label htmlFor="sub2category">Product</label>
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
                            </div> */}
                        </form>
                    </div>
                    <div className="col-12 col-md-7">
                        <table id="tbl" className="table table-hover table-responsive table-bordered">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Code</th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Qty</th>
                                    <th scope="col">Selling Price</th>
                                    <th scope="col">Wholesale Price</th>
                                    <th scope="col">Last Sold Price</th>
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
            </div>
        );
    }
}

export default Product;