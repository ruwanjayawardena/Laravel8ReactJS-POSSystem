<?php

namespace App\Http\Controllers;

use App\Models\outlet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class OutletController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $outlet = Outlet::all();
        return response()->json([
            'data' => $outlet
            ]
        );
    }
    
    public function cmbSupplier(){
        $outlet = Outlet::all()->sortBy("cus_name");
        return response()->json($outlet);
    }
    
    /**
    * Display a Filter Table Data
    *
    * @return \Illuminate\Http\Response
    */
    public function getDataTableFilterData(Request $request)
    {                    
        if($request->search['value'] != null){
            $outlet = DB::table('outlets')
            ->where('ol_outlet_name', 'LIKE', '%'.$request->search['value'].'%')            
            ->where('ol_location', 'LIKE', '%'.$request->search['value'].'%')            
            ->where('ol_contact_no', 'LIKE', '%'.$request->search['value'].'%')            
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }else{            
            $outlet = DB::table('outlets')
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }        
        return response()->json([      
            'data' => $outlet
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
            'ol_outlet_name' => 'required',          
            'ol_contact_no' => 'required|unique:customers,cus_contact_no|numeric|digits_between:1,12',            
            'ol_location' => 'required'            
        ];
        return $rules; 
    }
    
    public function rules_update($request){
        $rules = [         
            'ol_outlet_name' => 'required',           
            'ol_contact_no' => 'required|numeric|digits_between:1,12',            
            'ol_location' => 'required'            
        ];
        return $rules; 
    }
    
    /**
    * Custom Validation Messages        
    */     
    public function messages(){
        $messages = [ 
            'ol_outlet_name.required' => 'Outlet name is required',             
            'ol_contact_no.unique' => 'Contact number can not be duplicate',             
            'ol_contact_no.required' => 'Contact number is required',
            'ol_contact_no.numeric' => 'Contact number allowed numbers only',
            'ol_contact_no.digits_between' => 'Contact number allowed max 12 numbers only',
            'ol_location.required' => 'Location is required',           
        ];        
        return $messages;
    }
    
    public function messages_update(){
        $messages = [ 
            'ol_outlet_name.required' => 'Outlet name is required',
            'ol_contact_no.required' => 'Contact number is required',
            'ol_contact_no.numeric' => 'Contact number allowed numbers only',
            'ol_contact_no.digits_between' => 'Contact number allowed max 12 numbers only',
            'ol_location.required' => 'Location is required'
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
            $outlet = new Outlet;
            
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
                $outlet->create($request->all());
                $msgType = 1;
                $globalErrorMsg = "Successfully Saved.";                                             
            }            
            return response()->json([
                'msgType' => $msgType,
                'message' => $globalErrorMsg,
                'outlet' => $outlet
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
    public function show(Outlet $outlet)
    {
        return response()->json([$outlet]);
    } 
    
    
    /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  \App\Models\Supplier  $supplier
    * @return \Illuminate\Http\Response
    */
    public function update(Request $request, Outlet $outlet)
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
                $outlet->update($request->all());
                $msgType = 1;
                $globalErrorMsg = "Successfully Updated.";                                             
            }
            
            return response()->json([
                'msgType' => $msgType,
                'message' => $globalErrorMsg,
                'outlet' => $outlet
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
    public function destroy(Outlet $outlet)
    {
        try {                                                              
            $outlet->delete();
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
