import React from "react";
// import axios from 'axios';
import Select from 'react-select';
// import Swal from 'sweetalert2';
// import StockProductTable from './StockProductTable';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Stockmodal extends React.Component {    
    
    constructor(props) {
        super(props);
        this.state = {
            cmbMainCategoryOptions: this.props.cmbMainCategoryOptions,
            selectedMainCatOption: this.props.selectedMainCatOption,
            cmbSubCategoryOptions: this.props.cmbSubCategoryOptions,
            selectedSubCatOption: this.props.selectedSubCatOption,
            cmbSub2CategoryOptions:this.props.cmbSub2CategoryOptions,
            selectedSub2CatOption: this.props.selectedSub2CatOption,
            cmbProductOptions: this.props.cmbProductOptions,
            selectedProductOption: this.props.selectedProductOption,            
            selectbox_disable: this.props.selectbox_disable,            
        //     stockArray:[]
        };
        console.log('STOCKMODAL CLASS:  '+this.state.selectedMainCatOption.label);
        
        // //for access this event this keyword need to bind for the function
        // this.onChangeMainCategory = this.onChangeMainCategory.bind(this);
        // this.cmbMainCategory = this.cmbMainCategory.bind(this);
        // this.onChangeSubCategory = this.onChangeSubCategory.bind(this);
        // this.cmbSubCategory = this.cmbSubCategory.bind(this);
        // this.onChangeSub2Category = this.onChangeSub2Category.bind(this);
        // this.cmbSub2Category = this.cmbSub2Category.bind(this);
        // this.cmbProducts = this.cmbProducts.bind(this);
        // this.onChangeProduct = this.onChangeProduct.bind(this);       
        // this.addStock = this.addStock.bind(this);         
        
    }
    
    // componentDidMount() { 
    //         this.setState({cmbMainCategoryOptions: this.props.cmbMainCategoryOptions});
    //         this.setState({selectedMainCatOption: this.props.selectedMainCatOption});
              
    //     // this.cmbMainCategory((selectedMC) => {
    //     //     this.cmbSubCategory(selectedMC, (selectedSC) => {
    //     //         this.cmbSub2Category(selectedSC, (selectedS2C) => {
    //     //             this.cmbProducts(selectedS2C);
    //     //         });
    //     //     });
    //     // });        
    // }

    // componentDidUpdate(){
    //     this.setState({cmbMainCategoryOptions: this.props.cmbMainCategoryOptions});
    //     this.setState({selectedMainCatOption: this.props.selectedMainCatOption});
    // }
    
    // onChangeMainCategory(event) {
    //     this.setState({ selectedMainCatOption: event });
    //     this.cmbSubCategory(event.value, (selectedSC) => {
    //         this.cmbSub2Category(selectedSC, (selectedS2C) => {
    //             this.cmbProducts(selectedS2C);
    //         });
    //     });
    // }
    
    // onChangeSubCategory(event) {
    //     this.setState({ selectedSubCatOption: event });
    //     this.cmbSub2Category(event.value, (selectedS2C) => {
    //         this.cmbProducts(selectedS2C);
    //     });
    // }
    
    // onChangeSub2Category(event) {
    //     this.setState({ selectedSub2CatOption: event });
    //     this.cmbProducts(event.value);
    // }
    
    // onChangeProduct(event) {
    //     this.setState({ selectedProductOption: event });
        
    // }
    
    // cmbMainCategory(callback) {
    //     const self = this;
    //     let selectedMCVal = null;
    //     self.setState({ selectedMainCatOption: [] });
    //     self.setState({ cmbMainCategoryOptions: [] });
    //     const url = '/api/cmb/maincategory';
    //     axios.get(url)
    //     .then(function (response) {
    //         // handle success             
    //         const json = response.data;
    //         let templabel = "";
    //         let cmbOption;
    //         const count = Object.keys(json).length;
    //         if (count == 0) {
    //             self.setState({ selectedMainCatOption: [] });
    //             self.setState({ cmbMainCategoryOptions: [] });
    //         } else {
    //             $.each(json, function (index, maincategory) {
    //                 templabel = maincategory.code + '-' + maincategory.category;
    //                 cmbOption = { value: maincategory.id, label: templabel, code: maincategory.code }
    //                 if (parseInt(index) == 0) {
    //                     selectedMCVal = cmbOption.value;
    //                     self.setState({ selectedMainCatOption: cmbOption });
    //                 }
    //                 self.state.cmbMainCategoryOptions.push(cmbOption);
    //             });
    //         }
    //         if (callback instanceof Function) {
    //             callback(selectedMCVal);
    //         }
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     });
    // }
    
    // cmbSubCategory(maincategory, callback) {
    //     const self = this;
    //     let selectedSCVal = null;
    //     //array  cleared
    //     self.setState({ selectedSubCatOption: [] });
    //     self.setState({ cmbSubCategoryOptions: [] });
    //     const url = '/api/cmb/sub1categories/' + maincategory;
    //     axios.get(url)
    //     .then(function (response) {
    //         // handle success             
    //         const json = response.data;
    //         let cmbOption;
    //         const count = Object.keys(json).length;
    //         if (count == 0) {
    //             self.setState({ selectedSubCatOption: [] });
    //             self.setState({ cmbSubCategoryOptions: [] });
    //         } else {
    //             $.each(json, function (index, qData) {
    //                 cmbOption = { value: qData.id, label: qData.subcategory }
    //                 if (parseInt(index) == 0) {
    //                     selectedSCVal = cmbOption.value;
    //                     self.setState({ selectedSubCatOption: cmbOption });
    //                 }
    //                 self.state.cmbSubCategoryOptions.push(cmbOption);
    //             });
    //         }
    //         if (callback instanceof Function) {
    //             callback(selectedSCVal);
    //         }
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     });
    // }
    
    // cmbSub2Category(subcategory, callback) {
    //     const self = this;
    //     let selectedS2CVal = null;
    //     //array  cleared
    //     self.setState({ selectedSub2CatOption: [] });
    //     self.setState({ cmbSub2CategoryOptions: [] });
    //     const url = '/api/cmb/sub2categories/' + subcategory;
    //     axios.get(url)
    //     .then(function (response) {
    //         // handle success             
    //         const json = response.data;
    //         let cmbOption;
    //         const count = Object.keys(json).length;
    //         if (count == 0) {
    //             self.setState({ selectedSub2CatOption: [] });
    //             self.setState({ cmbSub2CategoryOptions: [] });
    //         } else {
    //             $.each(json, function (index, qData) {
    //                 cmbOption = { value: qData.id, label: qData.sub2category }
    //                 if (parseInt(index) == 0) {
    //                     selectedS2CVal = cmbOption.value;
    //                     self.setState({ selectedSub2CatOption: cmbOption });
    //                 }
    //                 self.state.cmbSub2CategoryOptions.push(cmbOption);
    //             });
    //         }
    //         if (callback instanceof Function) {
    //             callback(selectedS2CVal);
    //         }
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     });
    // }
    
    // cmbProducts(sub2category, callback) {
    //     const self = this;
    //     let selectedProductVal = null;
    //     //array  cleared
    //     self.setState({ selectedProductOption: [] });
    //     self.setState({ cmbProductOptions: [] });
    //     const url = '/api/cmb/products/' + sub2category;
    //     axios.get(url)
    //     .then(function (response) {
    //         // handle success             
    //         const json = response.data;
    //         let cmbOption;
    //         const count = Object.keys(json).length;
    //         if (count == 0) {
    //             self.setState({ selectedProductOption: [] });
    //             self.setState({ cmbProductOptions: [] });
    //         } else {
    //             $.each(json, function (index, qData) {
    //                 cmbOption = { value: qData.id, label: qData.product }
    //                 if (parseInt(index) == 0) {
    //                     selectedProductVal = cmbOption.value;
    //                     self.setState({ selectedProductOption: cmbOption });
    //                 }
    //                 self.state.cmbProductOptions.push(cmbOption);
    //             });
    //         }
    //         if (callback instanceof Function) {
    //             callback(selectedProductVal);
    //         }
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     });
    // }
    
    
    // addStock(e) {
    //     const self = this;
    //     e.preventDefault();
    //     const form = document.getElementById('frm');
    //     //form validation add  
    //     form.classList.add('was-validated');
    //     if (!form.checkValidity()) {
    //         e.preventDefault();
    //         e.stopPropagation();
    //     } else {
    //         const stock = {
    //             product: self.state.selectedProductOption.value,
    //             product_name: self.state.selectedProductOption.label,
    //             qty: $('#qty').val(),
    //             selling_price: $('#selling_price').val(),
    //             stock_price: $('#stock_price').val(),
    //             wholesale_price: $('#wholesale_price').val(),
    //             description: $('#description').val()
    //         };
    //        this.state.stockArray.push(stock);           
    //        localStorage.setItem('grnStockArray', JSON.stringify(this.state.stockArray));
    //     }
    // }
    
    render() {
        return (  
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
            <input type="text" className="form-control" id="qty" autoComplete="off" required />
            <label htmlFor="qty">Qty</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="stock_price" autoComplete="off" required />
            <label htmlFor="stock_price">Stock Price</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="selling_price" autoComplete="off" required />
            <label htmlFor="selling_price">Selling Price</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="wholesale_price" autoComplete="off" required />
            <label htmlFor="wholesale_price">Wholesale Price</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <textarea className="form-control" id="description" autoComplete="off" rows="5" defaultValue="-" required></textarea>
            <label htmlFor="description">Description</label>
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
            );
        }
    }
    
    export default Stockmodal;