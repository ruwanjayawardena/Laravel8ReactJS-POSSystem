import React from "react";
import axios from 'axios';
import Select from 'react-select';

class Samplepage extends React.Component {

    
    constructor(props) {
        super(props);
        this.state = {
          cmbMainCategoryOptions:[],
          selectedMainCategory:[],
          selectedMainCategoryID:0,
          selectedOption:[]
        };
    
        this.cmbMainCategory();  
        //for access this event this keyword need to bind for the function
        this.onChange = this.onChange.bind(this);        
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
                    self.setState({selectedOption:cmbOption});                   
                } 
                self.state.cmbMainCategoryOptions.push(cmbOption);
            });          
            
            if (typeof callback === "function") {                
                callback;
            }
            })
           .catch(function (error) {
             // handle error
             console.log(error);
           });
    }

    onChange(event) {
        this.setState({selectedOption:event});
    }
    
      render() {
        return (
          <div id="App">
            <h1>{this.props.pageheading}</h1>
            <Select className="mbMainCategory" options={this.state.cmbMainCategoryOptions} value={this.state.selectedOption} defaultValue={this.state.selectedOption} onChange={this.onChange}/>
        </div>
        );
      }
}

export default Samplepage;