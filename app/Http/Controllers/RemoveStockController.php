<?php

namespace App\Http\Controllers;

use App\Models\RemoveStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class RemoveStockController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $removeStock = RemoveStock::all();
        return response()->json([
            'data' => $removeStock
            ]
        );
    }
    
    /**
    * Display a Filter Table Data
    *
    * @return \Illuminate\Http\Response
    */
    public function getDataTableFilterData(Request $request)
    {                    
        if($request->search['value'] != null){
            $removeStock = DB::table('remove_stocks')
            ->join('products',  'remove_stocks.product','=','products.id')
            ->select('remove_stocks.*','products.product_code','products.product as product_name','products.qty as product_qty')
            ->where('remove_stocks.remove_note', 'LIKE', '%'.$request->search['value'].'%')            
            ->orwhere('products.product', 'LIKE', '%'.$request->search['value'].'%')            
            ->orwhere('products.product_code', 'LIKE', '%'.$request->search['value'].'%')            
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }else{            
            $removeStock = DB::table('remove_stocks')
            ->join('products',  'remove_stocks.product','=','products.id')
            ->select('remove_stocks.*','products.product_code','products.product as product_name','products.qty as product_qty')
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }        
        return response()->json([      
            'data' => $removeStock
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
            'product' => 'required',           
            'qty' => 'required',
            'remove_note' => 'required'           
        ];
        return $rules; 
    }
    
    /**
    * Custom Validation Messages        
    */     
    public function messages(){
        $messages = [ 
            'product.required' => 'Product selection is required',             
            'qty.unique' => 'Qty is required',             
            'remove_note.required' => 'Remove Not is required'            
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
            $removeStock = new RemoveStock;
            
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
                DB::beginTransaction(); 
                
                $affectedStockRemove = $removeStock->create($request->all());
                
                if($affectedStockRemove){
                    $productQtyUpdate = DB::table('products')
                    ->where('id',$request->product)
                    ->decrement('qty',$request->qty); 
                    
                    if($productQtyUpdate){
                        DB::commit();
                        $msgType = 1;
                        $globalErrorMsg = "Successfully removed.";  
                    }else{
                        DB::rollBack();
                        $msgType = 0;
                        $globalErrorMsg = "Stock removing failed due to Product Qty updation failed.";  
                    }                    
                }else{
                    DB::rollBack();
                    $msgType = 0;
                    $globalErrorMsg = "Stock removing failed.";  
                }
            }            
            return response()->json([
                'msgType' => $msgType,
                'message' => $globalErrorMsg
                ]);           
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
        * @param  \App\Models\RemoveStock  $removeStock
        * @return \Illuminate\Http\Response
        */
        public function show(RemoveStock $removeStock)
        {
            return response()->json([$removeStock]);
        }   
        
    }
    