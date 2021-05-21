<?php

namespace App\Http\Controllers;

use App\Models\Maincategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use DB;


class MaincategoryController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $maincategory = Maincategory::all();
        //this type generate for datatable.net style
        return response()->json([
            'data' => $maincategory
            ]);
        }      
        
        
        //Load Main category combo box
        public function cmbMainCategory(Request $request){
            $maincategory = DB::table('maincategories')
            ->orderBy('category', 'asc')
            ->get();            
            return response()->json($maincategory);
        }
        
        public function getDataTableFilterData(Request $request){ 
            
            $recordsTotal = Maincategory::count();
            
            if($request->search['value'] != null){
                $maincategory = DB::table('maincategories')
                ->where('category', 'LIKE', '%'.$request->search['value'].'%')
                ->orWhere('code', 'LIKE','%'.$request->search['value'].'%')
                ->offset($request->start)
                ->limit($request->length)
                ->orderBy('id', 'desc')
                ->get();
            }else{            
                $maincategory = DB::table('maincategories')
                ->offset($request->start)
                ->limit($request->length)
                ->orderBy('id', 'desc')
                ->get();
            }
            
            $recordsFiltered = $maincategory->count();
            $draw = 1;
            
            return response()->json([
                //'recordsFiltered'=> $recordsFiltered,
                //'recordsTotal' => $recordsTotal,        
                'data' => $maincategory
                ]);        
                
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
                    //validation rules initiate
                    $rules = [
                        'category'=>'required',
                        'code'=>'required|unique:maincategories,code|max:3|min:3',
                    ];
                    
                    //custom message for validation initiate.if not need custom message remove $mssage from validator method.
                    //if we not set custom message for any validation it message will pop as default from laravel
                    $messages = [
                        'category.required' => 'Item is required', 
                        'code.unique' => 'This code already available.Please try again',  
                        'code.required' => 'Code is required',   
                        'code.max' => 'You are allowed maximum 3 characters code only', 
                        'code.min' => 'You must enter 3 characters code',              
                    ];
                    
                    //custom validation
                    $validator = Validator::make($request->all(),$rules,$messages);
                    
                    $errorsMsgObject = $validator->errors();
                    $allErrorMsgArray = array();
                    $globalErrorMsg = "";
                    $msgType = 0;
                    
                    //create model object
                    $maincategory = new Maincategory;
                    
                    if ($validator->fails()) { 
                        //validation failed warning message block  
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
                        //validation ok success message                 
                        $maincategory->create($request->all());                
                        $msgType = 1;
                        $globalErrorMsg = "Successfully Saved.";                                             
                    }
                    
                    return response()->json([
                        'msgType' => $msgType,
                        'message' => $globalErrorMsg,
                        'category' => $maincategory
                        ]); 
                        
                    } catch (\Throwable $th) {
                        return response()->json([
                            'msgType' => 0,
                            'message' => $th->getMessage()               
                            ]);
                        }       
                    }
                    
                    /**
                    * Display the specified resource.
                    *
                    * @param  \App\Models\Maincategory  $Maincategory
                    * @return \Illuminate\Http\Response
                    */
                    public function show(Maincategory $maincategory)    
                    {
                        return $maincategory;
                    }
                    
                    /**
                    * Update the specified resource in storage.
                    *
                    * @param  \Illuminate\Http\Request  $request
                    * @param  \App\Models\Maincategory  $Maincategory
                    * @return \Illuminate\Http\Response
                    */
                    public function update(Request $request, Maincategory $maincategory)
                    {
                        try {
                            //validation rules initiate
                            $rules = [
                                'category'=>'required',
                                'code'=>'required|max:3|min:3',
                            ];
                            
                            //custom message for validation initiate.if not need custom message remove $mssage from validator method.
                            //if we not set custom message for any validation it message will pop as default from laravel
                            $messages = [
                                'category.required' => 'Item is required',                                
                                'code.required' => 'Code is required',   
                                'code.max' => 'You are allowed maximum 3 characters code only', 
                                'code.min' => 'You must enter 3 characters code',              
                            ];
                            
                            //custom validation
                            $validator = Validator::make($request->all(),$rules,$messages);
                            
                            $errorsMsgObject = $validator->errors();
                            $allErrorMsgArray = array();
                            $globalErrorMsg = "";
                            $msgType = 0;
                            
                            if ($validator->fails()) { 
                                //validation failed warning message block  
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
                                //validation ok success message
                                $maincategory->update($request->all());
                                $msgType = 1;
                                $globalErrorMsg = "Successfully Updated.";                                             
                            }
                            
                            return response()->json([
                                'msgType' => $msgType,
                                'message' => $globalErrorMsg,
                                'category' => $maincategory
                                ]); 
                                
                            } catch (\Throwable $th) {
                                $message = "";
                                switch ($th->errorInfo[1]) {
                                    case 1062://code dublicate entry 
                                        $message = 'Item code can not be duplicate.';
                                        break;
                                        default:
                                        // case 1364:// you can handel any auther error
                                            $message =$th->getMessage();
                                            //     break; 
                                        }    
                                        
                                        return response()->json([
                                            'msgType' => 0,
                                            'message' => $message,               
                                            ]);   
                                        }
                                    }
                                    
                                    /**
                                    * Remove the specified resource from storage.
                                    *
                                    * @param  \App\Models\Maincategory  $Maincategory
                                    * @return \Illuminate\Http\Response
                                    */
                                    public function destroy(Maincategory $maincategory)
                                    {
                                        try {
                                            $maincategory->delete();
                                            return response()->json([
                                                'msgType' => 1,
                                                'message' => 'Successfully Deleted.'
                                                ]);
                                            } catch (\Throwable $th) {
                                                return response()->json([
                                                    'msgType' => 0,
                                                    'message' => $th->getMessage()               
                                                    ]);
                                                }
                                                
                                            }
                                        }
                                        