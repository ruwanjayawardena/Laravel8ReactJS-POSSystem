import React from "react";
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Datatable';
import '../Fontawesome';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class WeatherCRUD extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            location:[],
            temperature:[],
        }; 
        
        //for access this event this keyword need to bind for the function            
        this.loadDataTable = this.loadDataTable.bind(this);       
        this.save = this.save.bind(this);       
        this.clear = this.clear.bind(this);       
        this.edit = this.edit.bind(this);      
        this.filterByDate = this.filterByDate.bind(this);      
        
    }
    
    componentDidMount() { 
        this.temperatureFields();
        this.loadDataTable();
    }  
    
    filterByDate(e){
        e.preventDefault();
        const form = document.getElementById('frm_filter');

        const startdate = $('#startDate').val().toString();
        const enddate = $('#endDate').val().toString();

        const baseURL = '/api/weather/filterbydate/'+startdate+'/'+ enddate;

         //form validation add  
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
    } else {        
        form.classList.remove('was-validated');
        $('#tbl').DataTable({
            destroy: true,
            ajax: {
                'url': baseURL,
                'type': "GET",                
                // "datatype": 'json',
                // "data": {
                //     "startdate":startdate,
                //     "enddate":enddate 
                // },
            },
            columns: [                
                { data: 'id' },
                { data: 'date' },                
                { data: 'locationInfo',
                render: function ( data, type, row ) {
                    const locinfo = '<strong>Latituted:</strong> '+row.location.lat+'<br><strong>Lontitude: </strong>'+row.location.lon+'<br><strong>City: </strong>'+row.location.city+'<br><strong>State: </strong>'+row.location.state;
                    return locinfo;
                }
            },
            { data: 'temperatureInfo',
            render: function ( data, type, row ) {
                let tempInfo = "";
                let i=1;
                let ipm=1;
                row.temperature.forEach(function(tempVal,tempIndex) {
                    if(tempIndex <= 11){
                        tempInfo += '<strong>'+i+' AM: </strong>'+tempVal+'F,  ';                                
                    }else{
                        tempInfo += '<strong>'+ipm+' PM: </strong>'+tempVal+'F,  ';
                        ipm++;
                    }
                    i++;
                });                        
                return tempInfo;
                }
            },             
            {
                data: "action", render: function (data, type, row) {
                    return '<div class="d-grid gap-2"><button class="btn btn-dark btn-editrow" value="' + row.id + '">Edit</button><button class="btn btn-danger ms-1 text-white btn-deleterow" value="' + row.id + '"><FontAwesomeIcon icon="trash-alt"/> Delete</button></div>';
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
                    const editurl = '/api/weather/' + id;
                    axios.get(editurl)
                    .then(function (response) {
                        // handle success
                        let jsonData = response.data;
                        $.each(jsonData,function(index,qData){                                                               
                            $('#id').val(qData.id);
                            $('#date').val(qData.date);
                            self.setState({location:qData.location});
                            self.setState({temperature:qData.temperature});                            
                            $('#lat').val(qData.location.lat);
                            $('#lon').val(qData.location.lon);
                            $('#city').val(qData.location.city);
                            $('#state').val(qData.location.state);
                            qData.temperature.forEach(function(tmpData,tmpIndex){
                                tmpIndex++;                                
                                $('#hr_'+tmpIndex).val(tmpData);
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
                        title: 'Delete Weather Information!',
                        text: "Are you sure want to delete this?",
                        icon: 'warning',
                        showCancelButton: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const id = $(this).val();
                            const deleteurl = '/api/weather/' + id;
                            axios.delete(deleteurl)
                            .then(function (response) {
                                // handle success
                                let jsonData = response.data;
                                self.loadDataTable(); 
                                Swal.fire({
                                    title: 'Delete Weather Information!',
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
              
    }
    
    temperatureFields(){      
        let i = 1; 
        let ipm = 0;
        let fields = ""; 
        let status = "";
        fields += '<div class="row">';
        while(i<=24){
            if(i<=12){
                if(i==1){
                    fields += '<div class="col-md-6 col-6">';
                }
                status = "AM";
                fields += '<div class="input-group mb-3">';
                fields += '<span class="input-group-text">'+i+' '+status+'</span>';
                fields += '<input type="text" class="form-control tempData" id="hr_'+i+'" autoComplete="off" placeholder="0.0" required/>';
                fields += '<span class="input-group-text">F</span>';
                fields += '</div>'; 
                if(i==12){
                    fields += '</div>';
                }        
            }else{
                if(i==13){
                    fields += '<div class="col-md-6 col-6">';
                }  
                ipm++;
                status = "PM";
                fields += '<div class="input-group mb-3">';
                fields += '<span class="input-group-text">'+ipm+' '+status+'</span>';
                fields += '<input type="text" class="form-control tempData" id="hr_'+i+'" autoComplete="off" placeholder="0.0" required/>';
                fields += '<span class="input-group-text">F</span>';
                fields += '</div>';  
                if(i==24){
                    fields += '</div>';
                }         
            }      
            
            i++;
        }
        fields += '</div>';
        $('#temperatureFields').html('').append(fields);
    }
    
    
    
    loadDataTable() {
        const self = this;      
        
        const tblurl = '/api/weather/filterdata';
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
            },
            columns: [                
                { data: 'id' },
                { data: 'date' },                
                { data: 'locationInfo',
                render: function ( data, type, row ) {
                    const locinfo = '<strong>Latituted:</strong> '+row.location.lat+'<br><strong>Lontitude: </strong>'+row.location.lon+'<br><strong>City: </strong>'+row.location.city+'<br><strong>State: </strong>'+row.location.state;
                    return locinfo;
                }
            },
            { data: 'temperatureInfo',
            render: function ( data, type, row ) {
                let tempInfo = "";
                let i=1;
                let ipm=1;
                row.temperature.forEach(function(tempVal,tempIndex) {
                    if(tempIndex <= 11){
                        tempInfo += '<strong>'+i+' AM: </strong>'+tempVal+'F,  ';                                
                    }else{
                        tempInfo += '<strong>'+ipm+' PM: </strong>'+tempVal+'F,  ';
                        ipm++;
                    }
                    i++;
                });                        
                return tempInfo;
            }
        },             
        {
            data: "action", render: function (data, type, row) {
                return '<div class="d-grid gap-2"><button class="btn btn-dark btn-editrow" value="' + row.id + '">Edit</button><button class="btn btn-danger ms-1 text-white btn-deleterow" value="' + row.id + '"><FontAwesomeIcon icon="trash-alt"/> Delete</button></div>';
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
            const editurl = '/api/weather/' + id;
            axios.get(editurl)
            .then(function (response) {
                // handle success
                let jsonData = response.data;
                $.each(jsonData,function(index,qData){                                                               
                    $('#id').val(qData.id);
                    $('#date').val(qData.date);
                    self.setState({location:qData.location});
                    self.setState({temperature:qData.temperature});                            
                    $('#lat').val(qData.location.lat);
                    $('#lon').val(qData.location.lon);
                    $('#city').val(qData.location.city);
                    $('#state').val(qData.location.state);
                    qData.temperature.forEach(function(tmpData,tmpIndex){
                        tmpIndex++;                                
                        $('#hr_'+tmpIndex).val(tmpData);
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
                title: 'Delete Weather Information!',
                text: "Are you sure want to delete this?",
                icon: 'warning',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const id = $(this).val();
                    const deleteurl = '/api/weather/' + id;
                    axios.delete(deleteurl)
                    .then(function (response) {
                        // handle success
                        let jsonData = response.data;
                        self.loadDataTable(); 
                        Swal.fire({
                            title: 'Delete Weather Information!',
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
    e.preventDefault();
    const self = this;
    const form = document.getElementById('frm');
    //temperature array build
    let i = 1;
    let tempVal = 0;
    this.setState({temperature:[]});
    this.setState({location:[]});
    while(i<=24){
        tempVal = Number($("#hr_"+i).val()).toFixed(1);
        this.state.temperature.push(tempVal);
        i++;
    }
    
    //location json array build
    let lat = $('#lat').val();
    let lon = $('#lon').val();
    let city = $('#city').val();
    let state = $('#state').val();
    
    this.setState({location:{
        lat:lat,
        lon:lon,
        lat:lat,
        city:city,
        state:state
    }});
    
    //form validation add  
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
    } else {
        const url = '/api/weather';
        const weather = {
            date:$('#date').val(),
            location:self.state.location,
            temperature:self.state.temperature                          
        };
        axios.post(url, weather)
        .then(function (response) {
            // handle success
            const jsonData = response.data;
            if (jsonData.msgType == 1) {
                self.loadDataTable();
                Swal.fire({
                    title: 'Save Weather Information!',
                    text: jsonData.message,
                    icon: 'success',
                });
                //form validation remove and clear form after success                              
                form.reset();
                form.classList.remove('was-validated');
            } else {                        
                Swal.fire({
                    title: 'Save Weather Information!',
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
    //const self = this;
    e.preventDefault();
    const form = document.getElementById('frm');
    form.reset();
    this.loadDataTable();
    $('.btn-update').prop('hidden', true);
    $('.btn-save').prop('hidden', false);
    form.classList.remove('was-validated');
}

edit(e) {
    e.preventDefault();
    const self = this;
    const form = document.getElementById('frm');
    //temperature array build
    let i = 1;
    let tempVal = 0;
    let tempArray = [];
    this.setState({temperature:[]});
    this.setState({location:[]});
    while(i<=24){
        tempVal = Number($("#hr_"+i).val()).toFixed(1);
        //this.setState({temperature:tempArray});
        tempArray.push(tempVal)
        //this.state.temperature.push(tempVal);
        i++;
    }
    this.setState({temperature:tempArray});
    //console.log(this.state.temperature);
    
    //location json array build
    let lat = $('#lat').val();
    let lon = $('#lon').val();
    let city = $('#city').val();
    let state = $('#state').val();
    
    this.setState({location:{
        lat:lat,
        lon:lon,
        lat:lat,
        city:city,
        state:state
    }});        
    //form validation add  
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
    } else {
        Swal.fire({
            title: 'Update Weather Information!',
            text: "Do you want to update this?",
            icon: 'warning',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                const id = $('#id').val();
                const url = '/api/weather/' + id;
                const weather = {
                    date:$('#date').val(),
                    location:self.state.location,
                    temperature:self.state.temperature                         
                };
                axios.put(url, weather)
                .then(function (response) {
                    // handle success
                    const jsonData = response.data;                            
                    if (jsonData.msgType == 1) {
                        self.loadDataTable();
                        Swal.fire({
                            title: 'Update Weather Information!',
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
                            title: 'Update Weather Information!',
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
        <div className="container-fluid py-5 px-4">
        <div className="row">
        <h3 className="display-6"><FontAwesomeIcon icon="cloud-sun-rain" /> Weather App (Laravel 8|ReactJS|Bootstrap5)</h3>
        <p className="lead text-muted fs-6 mb-4">Actions runs with Weather API</p>
        <div className="col-12 col-md-5">                      
        <form id="frm" className="needs-validation" noValidate>
        <input type="hidden" id="id" />                            
        <div className="row">
        <div className="col-md-5 col-12">
        <div className="form-floating mb-3">
        <input type="date" className="form-control" id="date" autoComplete="off" required/>
        <label htmlFor="date">Date</label>
        <div className="valid-feedback">Looks good!</div>
        <div className="invalid-feedback">Required Field.</div>
        </div>
        <div className="form-floating mb-3">
        <input type="text" className="form-control" id="lat" autoComplete="off" required/>
        <label htmlFor="lat">Lat</label>
        <div className="valid-feedback">Looks good!</div>
        <div className="invalid-feedback">Required Field.</div>
        </div>
        <div className="form-floating mb-3">
        <input type="text" className="form-control" id="lon" autoComplete="off" placeholder="EX: Box Bar" required/>
        <label htmlFor="lon">Lon</label>
        <div className="valid-feedback">Looks good!</div>
        <div className="invalid-feedback">Required Field.</div>
        </div>
        <div className="form-floating mb-3">
        <input type="text" className="form-control" id="city" autoComplete="off" required/>
        <label htmlFor="city">City</label>
        <div className="valid-feedback">Looks good!</div>
        <div className="invalid-feedback">Required Field.</div>
        </div>
        <div className="form-floating mb-3">
        <input type="text" className="form-control" id="state" autoComplete="off" required/>
        <label htmlFor="state">State</label>
        <div className="valid-feedback">Looks good!</div>
        <div className="invalid-feedback">Required Field.</div>
        </div>
        </div>
        <div className="col-md-7 col-12">
        <div id="temperatureFields"></div>
        </div>                           
        </div>
        <div className="row">
        <div className="col-md-12 col-12">
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
        </div>
        </div>                          
        </form>
        </div>
        <div className="col-12 col-md-7"> 
        <form id="frm_filter" className="needs-validation" noValidate>
        <div className="row">        
        <h4><FontAwesomeIcon icon="filter" /> Filter Data</h4>
        <div className="col input-group mb-3">
        <span className="input-group-text">Start Date</span>
        <input type="date" className="form-control" id="startDate" autoComplete="off" required/>
        <div className="valid-feedback">Looks good!</div>
        <div className="invalid-feedback">Required Field.</div>
        </div>
        <div className="col input-group mb-3">
        <span className="input-group-text">End Date</span>
        <input type="date" className="form-control" id="endDate" autoComplete="off" required/>        
        <div className="valid-feedback">Looks good!</div>
        <div className="invalid-feedback">Required Field.</div>
        </div>        
        <div className="col">
            <div className="btn-group">
            <button type="button" className="btn btn-primary text-white btn-filter" onClick={this.filterByDate}>
        <FontAwesomeIcon icon="filter" /> Filter
        </button>        
        <button type="button" className="btn btn-dark btn-refresh" onClick={this.clear}>
        <FontAwesomeIcon icon="redo-alt" /> Refresh
        </button>
            </div>       
        </div>
        </div> 
        </form> 
        <div className="row">
        <div className="col-12 col-md-12">
        <table id="tbl" className="table table-hover table-responsive table-bordered">
        <thead className="table-dark">
        <tr>
        <th scope="col">#</th>
        <th scope="col">Date</th>
        <th scope="col">Location</th>
        <th scope="col">Temperature</th>                                    
        <th scope="col">Action</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
        </table>
        </div>
        </div>            
        </div>
        </div>
        </div>
        );
    }
}


export default WeatherCRUD;