import React from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Outlet extends React.Component {
    
    
    constructor(props) {
        super(props);
        this.state = {};        
        //for access this event this keyword need to bind for the function
        this.save = this.save.bind(this);
        this.clear = this.clear.bind(this);
        this.edit = this.edit.bind(this);
    }
    
    componentDidMount() {
        this.loadDataTable();              
    }   
    
    loadDataTable() {
        const self = this;        
        const tblurl = '/api/outlet/filterdata';
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
                { data: 'ol_outlet_name' },
                { data: 'ol_location' },              
                { data: 'ol_contact_no' },
                { data: 'ol_updated_at' },
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
                    const editurl = '/api/outlet/' + id;
                    axios.get(editurl)
                    .then(function (response) {
                        // handle success
                        let jsonData = response.data;                       
                        $.each(jsonData, function (index, qData) {                            
                            $('#ol_outlet_name').val(qData.ol_outlet_name);
                            $('#ol_location').val(qData.ol_location);
                            $('#ol_contact_no').val(qData.ol_contact_no);                           
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
                        title: 'Delete Outlet!',
                        text: "Are you sure want to delete?",
                        icon: 'warning',
                        showCancelButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const id = $(this).val();
                            const deleteurl = '/api/outlet/' + id;
                            axios.delete(deleteurl)
                            .then(function (response) {
                                // handle success
                                let jsonData = response.data;
                                self.loadDataTable();
                                Swal.fire({
                                    title: 'Delete Outlet!',
                                    text: jsonData.message,
                                    icon: 'success',
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
            const url = '/api/outlet';
            
            const outlet = {
                ol_outlet_name: $('#ol_outlet_name').val(),
                ol_location: $('#ol_location').val(),
                ol_contact_no: $('#ol_contact_no').val()
            };
            
            axios.post(url, outlet)
            .then(function (response) {
                // handle success
                const jsonData = response.data;
                if (jsonData.msgType == 1) {
                    self.loadDataTable();
                    Swal.fire({
                        title: 'Save Outlet!',
                        text: jsonData.message,
                        icon: 'success',
                    });
                    //form validation remove and clear form after success                              
                    form.reset();
                    form.classList.remove('was-validated');
                } else {
                    Swal.fire({
                        title: 'Save Outlet!',
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
                title: 'Update Outlet!',
                text: "Do you want to update this?",
                icon: 'info',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = $('#id').val();
                    const url = '/api/outlet/' + id;
                    const outlet = {
                        ol_outlet_name: $('#ol_outlet_name').val(),
                        ol_location: $('#ol_location').val(),
                        ol_contact_no: $('#ol_contact_no').val()
                    };
                    axios.put(url, outlet)
                    .then(function (response) {
                        // handle success
                        const jsonData = response.data;
                        if (jsonData.msgType == 1) {
                            self.loadDataTable();
                            Swal.fire({
                                title: 'Update Outlet!',
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
                                title: 'Update Outlet!',
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
            <h3 className="display-6"><FontAwesomeIcon icon="store" /> Outlet Setup</h3>
            <p className="lead text-muted fs-6 mb-4">Manage all outlets </p>
            <div className="col-12 col-md-5">
            <form id="frm" className="needs-validation" noValidate>
            <input type="hidden" id="id" />
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="ol_outlet_name" autoComplete="off" required />
            <label htmlFor="ol_outlet_name">Outlet Name</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="text" className="form-control" id="ol_location" autoComplete="off" required />
            <label htmlFor="ol_location">Location</label>
            <div className="valid-feedback">Looks good!</div>
            <div className="invalid-feedback">Required Field.</div>
            </div>
            <div className="form-floating mb-3">
            <input type="tel" className="form-control" id="ol_contact_no" max="12" autoComplete="off" required />
            <label htmlFor="ol_contact_no">Contact No</label>
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
            <th scope="col">Outlet</th>
            <th scope="col">Location</th>
            <th scope="col">Contact No</th>
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
    
    export default Outlet;