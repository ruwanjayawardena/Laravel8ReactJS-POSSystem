import React, { useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../Datatable';

function Maincategory() {

    //on load event
    useEffect(() => {
        loadDataTable();
    }, []);

    function loadDataTable() {
        //'datatables.net'
        //require( ['jquery','jszip', 'pdfmake','datatables.net-bs4','datatables.net-buttons-bs4','datatables.net-buttons/js/buttons.colVis.js','datatables.net-buttons/js/buttons.html5.js','datatables.net-buttons/js/buttons.print.js'], function ($) {
        $('#tbl_maincategory').DataTable({

            //responsive:true,
            ajax: "/api/maincategories/filterdata",
            destroy: true,
            //processing: true,
            serverSide: true,
            serverMethod: 'POST',
            columns: [
                { data: 'id' },
                { data: 'code' },
                { data: 'category' },
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
                // { extend: 'copy', className: 'btn btn-dark' },
                // { extend: 'excel', className: 'btn btn-primary' }
            ],
            bInfo: false,
            drawCallback: function () {
                //load editable data into leftside form
                $('.btn-editrow').click(function () {
                    $('.btn-update').prop('hidden', false);
                    $('.btn-save').prop('hidden', true);
                    const id = $(this).val();
                    const url = '/api/maincategories/' + id;
                    axios.get(url)
                        .then(function (response) {
                            // handle success
                            let jsonData = response.data;
                            $('#category').val(jsonData.category);
                            $('#code').val(jsonData.code);
                            $('#id').val(jsonData.id);

                        })
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });
                })

                //delete 
                $('.btn-deleterow').click(function () {
                    Swal.fire({
                        title: 'Delete Item!',
                        text: "Are you sure want to delete this?",
                        icon: 'warning',
                        showCancelButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const id = $(this).val();
                            const url = '/api/maincategories/' + id;
                            axios.delete(url)
                                .then(function (response) {
                                    // handle success
                                    let jsonData = response.data;
                                    loadDataTable();
                                    Swal.fire({
                                        title: 'Delete Item!',
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
        //}); 

    }

    //testing purposes
    function loadTable() {
        const url = '/api/maincategories';

        axios.get(url)
            .then(function (response) {
                // handle success
                // console.log('Loading Started...');
                const json = response.data;

                const tableText = "";
                $.each(json, function (index, maincategory) {
                    tableText += '<tr>';
                    tableText += '<td scope="row">' + maincategory.id + '</td>';
                    tableText += '<td>' + maincategory.category + '</td>';
                    tableText += '<td>' + maincategory.code + '</td>';
                    tableText += '<td>' + maincategory.updated_at + '</td>';
                    tableText += '<td></td>';
                    tableText += '</tr>';
                });
                $('#tbl_maincategory tbody').html('').append(tableText);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
                // console.log("Loading finished")
            });
    }

    function save(addEventListener) {
        addEventListener.preventDefault();
        const form = document.getElementById('frm_maincategory');
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
                            title: 'Save Item!',
                            text: jsonData.message,
                            icon: 'success',
                        });
                        //form validation remove and clear form after success                              
                        form.reset();
                        form.classList.remove('was-validated');
                    } else {
                        Swal.fire({
                            title: 'Save Item!',
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
        const form = document.getElementById('frm_maincategory');
        form.reset();
        $('.btn-update').prop('hidden', true);
        $('.btn-save').prop('hidden', false);
        form.classList.remove('was-validated');
    }

    function checkValidity() {
        const str = $('#code').val();
        //make uppercase
        const code = str.toUpperCase();
        //remove white/blank space
        const validatedStr = code.replace(/ /g, "");
        $('#code').val(validatedStr);
    }

    function edit(addEventListener) {
        addEventListener.preventDefault();
        const form = document.getElementById('frm_maincategory');
        //form validation add  
        form.classList.add('was-validated');
        if (!form.checkValidity()) {
            addEventListener.preventDefault();
            addEventListener.stopPropagation();
        } else {
            Swal.fire({
                title: 'Update Item!',
                text: "Do you want to update this?",
                icon: 'warning',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = $('#id').val();
                    const url = '/api/maincategories/' + id;
                    const category = {
                        category: $('#category').val(),
                        code: $('#code').val()
                    };
                    axios.put(url, category)
                        .then(function (response) {
                            // handle success
                            const jsonData = response.data;
                            loadDataTable();
                            if (jsonData.msgType == 1) {
                                Swal.fire({
                                    title: 'Update Item!',
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
                                    title: 'Update Item!',
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

    return (
        <div className="container py-5 px-2">
            <div className="row">
                <h3 className="display-6"><FontAwesomeIcon icon="sitemap" /> Item Setup</h3>
                <p className="lead text-muted fs-6 mb-4">Add, Edit and Delete Items</p>
                <div className="col-12 col-md-5">
                    <form id="frm_maincategory" className="needs-validation" noValidate>
                        <input type="hidden" id="id" />
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="category" autoComplete="off" placeholder="EX: Box Bar" required />
                            <label htmlFor="category">Item</label>
                            <div className="valid-feedback">Looks good!</div>
                            <div className="invalid-feedback">Required Field.</div>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="text" className="form-control" id="code" maxLength="3" minLength="3" autoComplete="off" placeholder="Ex: CDA" onKeyUp={checkValidity} required />
                            <label htmlFor="code">Code</label>
                            <div className="valid-feedback">Looks good!</div>
                            <div className="invalid-feedback">Required Field & Need 3 character code.</div>
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
                    <table id="tbl_maincategory" className="table table-hover table-responsive table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Code</th>
                                <th scope="col">Item</th>
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

export default Maincategory




