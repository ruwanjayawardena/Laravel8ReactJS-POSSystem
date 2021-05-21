<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class SupplierController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $supplier = Supplier::all();
        return response()->json([
            'data' => $supplier
            ]
        );
    }
    
    public function cmbSupplier(){
        $supplier = Supplier::all()->sortBy("name");
        return response()->json($supplier);
    }
    
    /**
    * Display a Filter Table Data
    *
    * @return \Illuminate\Http\Response
    */
    public function getDataTableFilterData(Request $request)
    {                    
        if($request->search['value'] != null){
            $suppliers = DB::table('suppliers')
            ->where('name', 'LIKE', '%'.$request->search['value'].'%')            
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }else{            
            $suppliers = DB::table('suppliers')
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }        
        return response()->json([      
            'data' => $suppliers
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
            'name' => 'required|unique:suppliers,name',          
            'contact_person' => 'required',
            'contact_no' => 'required|max:12',
            'description' => 'required'            
        ];
        return $rules; 
    }
    
    public function rules_update($request){
        $rules = [         
            'name' => 'required',           
            'contact_person' => 'required',
            'contact_no' => 'required|max:12',
            'description' => 'required'            
        ];
        return $rules; 
    }
    
    /**
    * Custom Validation Messages        
    */     
    public function messages(){
        $messages = [ 
            'name.required' => 'Supplier Name is required',             
            'name.unique' => 'Supplier can not be duplicate',             
            'contact_person.required' => 'Contact person is required',
            'contact_no.required' => 'Contact no is required',
            'contact_no.max' => 'Enter valid contact number',
            'description.required' => 'Stock Description is required',
        ];        
        return $messages;
    }
    
    public function messages_update(){
        $messages = [ 
            'name.required' => 'Supplier Name is required',
            'contact_person.required' => 'Contact person is required',
            'contact_no.required' => 'Contact no is required',
            'contact_no.max' => 'Enter valid contact number',
            'description.required' => 'Stock Description is required',
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
            $supplier = new Supplier;
            
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
                $supplier->create($request->all());
                $msgType = 1;
                $globalErrorMsg = "Successfully Saved.";                                             
            }            
            return response()->json([
                'msgType' => $msgType,
                'message' => $globalErrorMsg,
                'supplier' => $supplier
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
    public function show(Supplier $supplier)
    {
        return response()->json([
            $supplier]
        );
    } 
    
    
    /**
    * Update the specified resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @param  \App\Models\Supplier  $supplier
    * @return \Illuminate\Http\Response
    */
    public function update(Request $request, Supplier $supplier)
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
                $supplier->update($request->all());
                $msgType = 1;
                $globalErrorMsg = "Successfully Updated.";                                             
            }
            
            return response()->json([
                'msgType' => $msgType,
                'message' => $globalErrorMsg,
                'supplier' => $supplier
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
    public function destroy(Supplier $supplier)
    {
        try {                                                              
            $supplier->delete();
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
