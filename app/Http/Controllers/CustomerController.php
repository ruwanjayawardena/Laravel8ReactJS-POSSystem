<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class CustomerController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $supplier = Customer::all();
        return response()->json([
            'data' => $supplier
            ]
        );
    }
    
    public function cmbCustomer(){
        $customer = Customer::all()->sortBy("cus_name");
        return response()->json($customer);
    }

    public function cmbCustomerIDDesc(){
        $customer = DB::table('customers')
        ->orderBy('id', 'desc')
        ->get();
        return response()->json($customer);
    }
    
    /**
    * Display a Filter Table Data
    *
    * @return \Illuminate\Http\Response
    */
    public function getDataTableFilterData(Request $request)
    {                    
        if($request->search['value'] != null){
            $customer = DB::table('customers')
            ->where('cus_name', 'LIKE', '%'.$request->search['value'].'%')            
            ->where('cus_address', 'LIKE', '%'.$request->search['value'].'%')            
            ->where('cus_contact_no', 'LIKE', '%'.$request->search['value'].'%')            
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }else{            
            $customer = DB::table('customers')
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }        
        return response()->json([      
            'data' => $customer
            ]
        );
    }
    
    /**
    * Validation Rules
    *
    * @return \Illuminate\Http\Response
    */    
    public function rules($request){
        $rules = [
            'cus_name' => 'required',          
            'cus_contact_no' => 'required|unique:customers,cus_contact_no|numeric|digits_between:1,12',            
            'cus_address' => 'required'            
        ];
        return $rules; 
    }
    
    public function rules_update($request){
        $rules = [         
            'cus_name' => 'required',           
            'cus_contact_no' => 'required|numeric|digits_between:1,12',            
            'cus_address' => 'required'            
        ];
        return $rules; 
    }
    
    /**
    * Custom Validation Messages        
    */     
    public function messages(){
        $messages = [ 
            'cus_name.required' => 'Customer name is required',             
            'cus_contact_no.unique' => 'Contact number can not be duplicate',             
            'cus_contact_no.required' => 'Contact number is required',
            'cus_contact_no.numeric' => 'Contact number allowed numbers only',
            'cus_contact_no.digits_between' => 'Contact number allowed max 12 numbers only',
            'cus_address.required' => 'Address is required',           
        ];        
        return $messages;
    }
    
    public function messages_update(){
        $messages = [ 
            'cus_name.required' => 'Customer name is required', 
            'cus_contact_no.required' => 'Contact number is required',
            'cus_contact_no.numeric' => 'Contact number allowed numbers only',
            'cus_contact_no.digits_between' => 'Contact number allowed max 12 numbers only',
            'cus_address.required' => 'Address is required', 
        ];        
        return $messages;
    }
    
    
    /**
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    public function store(Request $request)
    {
        try {             
            //Custom validation
            $validator = Validator::make(
                $request->all(),
                $this->rules($request),
                $this->messages()
            );
            $errorsMsgObject = $validator->errors();
            $allErrorMsgArray = array();
            $globalErrorMsg = "";
            $msgType = 0;
            
            //Model object
            $customer = new Customer;
            
            if ($validator->fails()) { 
                //Validation failed warning message block  
                $jsonMsgtype = 2;            
                foreach ($errorsMsgObject->all() as $message) {
                    $allErrorMsgArray[] = $message;
                } 
                if(isset($allErrorMsgArray) && !empty($allErrorMsgArray)){
                    $globalErrorMsg = implode(' | ',$allErrorMsgArray);
                } else{
                    $globalErrorMsg = "A problem has been occurred while saving data. Please Try again later.";
                } 
            }else{
                //Validation ok success message                              
                $customer->create($request->all());
                $msgType = 1;
                $globalErrorMsg = "Successfully Saved.";                                             
            }            
            return response()->json([
                'msgType' => $msgType,
                'message' => $globalErrorMsg,
                'customer' => $customer
                ]
            );           
        } catch (\Throwable $th) {
            return response()->json([
                'msgType' => 0,
                'messageLine' => $th->getLine(),               
                'message' => $th->getMessage()               
                ]
            );
        } 
    }
    
    /**
    * Display the specified resource.
    *
    * @param  \App\Models\Supplier  $supplier
    * @return \Illuminate\Http\Response
    */
    public function show(Customer $customer)
    {
        return response()->json([$customer]);
    } 
    
    
    /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  \App\Models\Supplier  $supplier
    * @return \Illuminate\Http\Response
    */
    public function update(Request $request, Customer $customer)
    {
        try {                                            
            //Custom validation
            $validator = Validator::make(
                $request->all(),
                $this->rules_update($request),
                $this->messages_update()
            );
            
            $errorsMsgObject = $validator->errors();
            $allErrorMsgArray = array();
            $globalErrorMsg = "";
            $msgType = 0;
            
            if ($validator->fails()) { 
                //Validation failed warning message block  
                $jsonMsgtype = 2;            
                foreach ($errorsMsgObject->all() as $message) {
                    $allErrorMsgArray[] = $message;
                } 
                if(isset($allErrorMsgArray) && !empty($allErrorMsgArray)){
                    $globalErrorMsg = implode(' | ',$allErrorMsgArray);
                } else{
                    $globalErrorMsg = "A problem has been occurred while updating data. Please Try again later.";
                } 
            }else{
                //Validation ok success message
                $customer->update($request->all());
                $msgType = 1;
                $globalErrorMsg = "Successfully Updated.";                                             
            }
            
            return response()->json([
                'msgType' => $msgType,
                'message' => $globalErrorMsg,
                'customer' => $customer
                ]
            );            
        } catch (\Throwable $th) {
            return response()->json([
                'msgType' => 0,
                'message' => $th->getMessage()               
                ]
            );
        }     
    }
    
    /**
    * Remove the specified resource from storage.
    *
    * @param  \App\Models\Supplier  $supplier
    * @return \Illuminate\Http\Response
    */
    public function destroy(Customer $customer)
    {
        try {                                                              
            $customer->delete();
            return response()->json([
                'msgType' => 1,
                'message' => 'Successfully Deleted.'
                ]
            );
        } catch (\Throwable $th) {
            return response()->json([
                'msgType' => 0,
                'message' => $th->getMessage()               
                ]
            );
        }
    }
}
