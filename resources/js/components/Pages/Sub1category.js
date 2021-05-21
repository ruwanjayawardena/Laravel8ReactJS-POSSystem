import React from "react";
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Sub1category extends React.Component {
    
    
    constructor(props) {
        super(props);
        this.state = {
            cmbMainCategoryOptions:[],
            selectedMainCategoryID:0,
            selectedMainCatOption:[]
        }; 

       //for access this event this keyword need to bind for the function
       this.onChangeMainCategory = this.onChangeMainCategory.bind(this); 
       this.cmbMainCategory = this.cmbMainCategory.bind(this);       
       this.loadDataTable = this.loadDataTable.bind(this);       
       this.save = this.save.bind(this);       
       this.clear = this.clear.bind(this);       
       this.edit = this.edit.bind(this);       
       
      
      this.cmbMainCategory(()=>{        
        this.loadDataTable();          
      }); 
    }

    // componentDidMount() {
    //     //this.loadDataTable(this.state.selectedMainCatOption.value)
    //     //this.cmbMainCategory(); 
    // }

    onChangeMainCategory(event){
        this.setState({selectedMainCatOption:event});        
        this.loadDataTable(event.value); 
    }
    
    cmbMainCategory(callback){
        const self = this;
        const url = '/api/cmb/maincategory';  
        axios.get(url)
        .then(function (response) {
            // handle success             
            const json = response.data;
            let templabel = "";
            let cmbOption;
            $.each(json, function(index,maincategory) {  
                templabel = maincategory.code+'-'+maincategory.category;   
                cmbOption =  {value:maincategory.id,label:templabel}  
                if(index == 0){
                    self.setState({selectedMainCatOption:cmbOption});                   
                } 
                self.state.cmbMainCategoryOptions.push(cmbOption);
            });
                        
            if (callback instanceof Function) {
                callback();
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
    }

    loadDataTable(maincategory_id) {
        const self = this;
        // console.log(maincategory_id);
        if(maincategory_id == 'undefined' || maincategory_id == null){
            // console.log(self.state.selectedMainCatOption);
            maincategory_id = self.state.selectedMainCatOption.value
        }
        const tblurl = '/api/sub1categories/filterdata';
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
                    "maincategory": maincategory_id
                }
            },
            columns: [
                { data: 'id' },
                { data: 'subcategory' },
                { data: 'updated_at' },
                {
                    data: "action", render: function (data, type, row) {
                        return '<button class="btn btn-dark btn-editrow" value="' + row.id + '">Edit</button><button class="btn btn-danger ms-1 text-white btn-deleterow" value="' + row.id + '"><FontAwesomeIcon icon="trash-alt"/> Delete</button>';
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
                    const editurl = '/api/sub1categories/' + id;
                    axios.get(editurl)
                        .then(function (response) {
                            // handle success
                            let jsonData = response.data;
                            $.each(jsonData,function(index,qData){
                                $('#subcategory').val(qData.subcategory);
                                self.setState({selectedMainCatOption:{value:qData.maincategory,label:qData.maincatname}});
                                $('#id').val(qData.id);
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
                        title: 'Delete Category!',
                        text: "Are you sure want to delete this?",
                        icon: 'warning',
                        showCancelButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const id = $(this).val();
                            const deleteurl = '/api/sub1categories/' + id;
                            axios.delete(deleteurl)
                                .then(function (response) {
                                    // handle success
                                    let jsonData = response.data;
                                    self.loadDataTable(); 
                                    Swal.fire({
                                        title: 'Delete Category!',
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
            const url = '/api/sub1categories';

            const category = {
                maincategory:self.state.selectedMainCatOption.value,
                subcategory: $('#subcategory').val()                
            };

            axios.post(url, category)
                .then(function (response) {
                    // handle success
                    const jsonData = response.data;
                    if (jsonData.msgType == 1) {
                        self.loadDataTable();
                        Swal.fire({
                            title: 'Save Category!',
                            text: jsonData.message,
                            icon: 'success',
                        });
                        //form validation remove and clear form after success                              
                        form.reset();
                        form.classList.remove('was-validated');
                    } else {                        
                        Swal.fire({
                            title: 'Save Category!',
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
                title: 'Update Category!',
                text: "Do you want to update this?",
                icon: 'warning',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = $('#id').val();
                    const url = '/api/sub1categories/' + id;
                    const category = {
                        maincategory:self.state.selectedMainCatOption.value,
                        subcategory: $('#subcategory').val()                        
                    };
                    axios.put(url, category)
                        .then(function (response) {
                            // handle success
                            const jsonData = response.data;                            
                            if (jsonData.msgType == 1) {
                                self.loadDataTable();
                                Swal.fire({
                                    title: 'Update Category!',
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
                                    title: 'Update Category!',
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
                    <h3 className="display-6"><FontAwesomeIcon icon="sitemap" /> Main Categorization</h3>
                    <p className="lead text-muted fs-6 mb-4">Use this section for item categorization into main. You are allowed to Add, Update and Delete created categories</p>
                    <div className="col-12 col-md-5">
                        <form id="frm" className="needs-validation" noValidate>
                            <input type="hidden" id="id" />                            
                            <div className="mb-3">
                            <Select className="mbMainCategory" options={this.state.cmbMainCategoryOptions} value={this.state.selectedMainCatOption} defaultValue={this.state.selectedMainCatOption} onChange={this.onChangeMainCategory}/>
                                <div className="valid-feedback">Looks good!</div>
                                <div className="invalid-feedback">Required Field.</div>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="subcategory" autoComplete="off" required />
                                <label htmlFor="subcategory">Category</label>
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
                                    <th scope="col">Category</th>
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
    
    export default Sub1category;