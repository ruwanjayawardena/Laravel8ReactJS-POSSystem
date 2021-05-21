<?php

namespace App\Http\Controllers;

use App\Models\stocktemp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class StocktempController extends Controller
{
    
    public function index(){
        $stock = stock::all();
        return response()->json([
            'data' => $stock
            ]
        );
    }
    
    public function getDataTableFilterData(Request $request){                    
        if($request->search['value'] != null){
            $products = DB::table('stocks')
            ->where('product', $request->product)
            ->where('name', 'LIKE', '%'.$request->search['value'].'%')            
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }else{            
            $products = DB::table('stocks')
            ->where('product', $request->product)
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }        
        return response()->json([      
            'data' => $products
            ]
        );
    }
    
    public function rules($request){
        $rules = [
            'product' => 'required',            
            'qty' => 'required',
            'price' => 'required',
            'wholesale_price' => 'required',            
            'description' => 'required',
            'status' => 'required',            
        ];
        return $rules; 
    }
    
    public function messages(){
        $messages = [ 
            'product.required' => 'Product is required',             
            'qty.required' => 'Quantity is required',
            'price.required' => 'Selling Price is required',
            'wholesale_price.required' => 'Wholesale price is required',
            'status.required' => 'Stock status is required',
            'description.required' => 'Stock Description is required',
        ];        
        return $messages;
    }
    
    public function store(Request $request){
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
            $stock = new stock;
            
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
                $stock->create($request->all());
                $msgType = 1;
                $globalErrorMsg = "Successfully Saved.";                                             
            }            
            return response()->json([
                'msgType' => $msgType,
                'message' => $globalErrorMsg,
                'stock' => $stock
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
    
    public function show(stock $stock){
        return response()->json($stock);
    }
    
    public function update(Request $request, stock $stock){
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
                $stock->update($request->all());
                $msgType = 1;
                $globalErrorMsg = "Successfully Updated.";                                             
            }
            
            return response()->json([
                'msgType' => $msgType,
                'message' => $globalErrorMsg,
                'stock' => $stock
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
    
    public function destroy(stock $stock){
        try {                                                              
            $stock->delete();
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
