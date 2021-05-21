import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../Datatable';
import Select from 'react-select';
import './Samplepage';
import Samplepage from './Samplepage';


function Sub1category(props) {

    let [cmbMainCategoryOptions] = useState([]);
    let [selectedMainCategory] = useState([]);
    let [selectedMainCategoryID] = useState(0);


    const mainCategoryOnChange = (selectedvalue) => {
        loadDataTable(selectedvalue.value);
        selectedMainCategory = selectedvalue;
        //console.log(selectedMainCategory);      
    }

    //on load event
    useEffect(() => {
        cmbMainCategory(cmbSelectedMainCategory);
    });


    const samplepageOnChange = (event) =>{
       // console.log(event);
    }

    const cmbSelectedMainCategory = (maincategory_id) => {
        setSelectedValue();
        loadDataTable(maincategory_id);

    }

    const getCurrentValue = (event) => {
        //console.log(event);
    }
    const setSelectedValue = () => {
        return selectedMainCategory;
    }

    const cmbMainCategory = (callback) => {
        const url = '/api/cmb/maincategory';
        // let getSelectedValue = 0;   
        axios.get(url)
            .then(function (response) {
                // handle success             
                const json = response.data;

                let templabel = "";
                let cmbOption;

                $.each(json, function (index, maincategory) {
                    templabel = maincategory.code + '-' + maincategory.category;
                    cmbOption = { value: maincategory.id, label: templabel }
                    if (index == 0) {
                        selectedMainCategory = cmbOption;
                        selectedMainCategoryID = maincategory.id
                    }
                    cmbMainCategoryOptions.push(cmbOption);
                });           

                if (typeof callback === "function") {
                    callback(selectedMainCategoryID);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    function loadDataTable(maincategory_id) {
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
                            $('#subcategory').val(jsonData.subcategory);
                            $('#id').val(jsonData.id);
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
                                    loadDataTable();
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


    function save(addEventListener) {
        addEventListener.preventDefault();
        const form = document.getElementById('frm');
        //form validation add  
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            addEventListener.preventDefault();
            addEventListener.stopPropagation();
        } else {
            const url = '/api/maincategories';

            const category = {
                category: $('#category').val(),
                code: $('#code').val(),
            };

            axios.post(url, category)
                .then(function (response) {
                    // handle success
                    const jsonData = response.data;
                    loadDataTable();
                    if (jsonData.msgType == 1) {
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


    function clear(addEventListener) {
        addEventListener.preventDefault();
        const form = document.getElementById('frm');
        form.reset();
        $('.btn-update').prop('hidden', true);
        $('.btn-save').prop('hidden', false);
        form.classList.remove('was-validated');
    }

    function edit(addEventListener) {
        addEventListener.preventDefault();
        const form = document.getElementById('frm');
        //form validation add  
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            addEventListener.preventDefault();
            addEventListener.stopPropagation();
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
                        category: $('#subcategory').val(),
                        code: $('#code').val()
                    };
                    axios.put(url, category)
                        .then(function (response) {
                            // handle success
                            const jsonData = response.data;
                            loadDataTable();
                            if (jsonData.msgType == 1) {
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

    let [selectedMainCategoryTemp] = useState({ value: 2, label: "XCC-Sample Category 2" });

    return (
        <div className="container py-5 px-2">
            <div className="row">
                <h3 className="display-6"><FontAwesomeIcon icon="sitemap" /> Sub Category 1</h3>
                <p className="lead text-muted fs-6 mb-4">Add, Edit and Delete Main categories</p>
                <div className="col-12 col-md-5">
                    <form id="frm" className="needs-validation" noValidate>
                        <input type="hidden" id="id" />
                        <div id="yearpiker"></div>
                        <div className="mb-3">
                            <Select className="mbMainCategory" defaultValue={setSelectedValue} options={cmbMainCategoryOptions} onChange={mainCategoryOnChange} />
                            <div className="valid-feedback">Looks good!</div>
                            <div className="invalid-feedback">Required Field.</div>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="subcategory" autoComplete="off" required />
                            <label htmlFor="subcategory">Sub Category</label>
                            <div className="valid-feedback">Looks good!</div>
                            <div className="invalid-feedback">Required Field.</div>
                        </div>
                        <div className="py-2 d-grid gap-2 d-md-block">
                            <button type="button" className="btn btn-success text-white btn-save" onClick={save}>
                                <FontAwesomeIcon icon="save" /> Add
                             </button>
                            <button type="button" className="btn ms-1 btn-warning btn-update" onClick={edit} hidden>
                                <FontAwesomeIcon icon="edit" />  Update
                             </button>
                            <button type="button" className="btn ms-1 btn-secondary btn-clear" onClick={clear}>
                                <FontAwesomeIcon icon="redo-alt" /> Clear
                             </button>
                        </div>
                    </form>
                </div>
                <div className="col-12 col-md-7">
                    <Samplepage pageheading="Hello World" />
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
    )
}

export default Sub1category
