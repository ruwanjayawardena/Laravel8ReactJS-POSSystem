<?php

namespace App\Http\Controllers;

use App\Models\Sub1category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class Sub1categoryController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $sub1category = Sub1category::all();
        return response()->json([
            'data' => $sub1category
            ]);
        }
        
        //Load Sub 1 category combo box
        public function cmbSubCategory(Request $request){
            
            // $sub1category = Sub1category::all()->where('maincategory', $request->id);
            $sub1category = DB::table('sub1categories')
            ->where('maincategory', $request->id)
            ->orderBy('id', 'asc')
            ->get();
            return response()->json($sub1category);
        }
        
        //get Sub 1 category datatable friendly formated data
        public function getDataTableFilterData(Request $request){
            
            if($request->search['value'] != null){
                $sub1category = DB::table('sub1categories')
                ->where('maincategory', $request->maincategory)
                ->where('subcategory', 'LIKE', '%'.$request->search['value'].'%')            
                ->offset($request->start)
                ->limit($request->length)
                ->orderBy('id', 'desc')
                ->get();
            }else{            
                $sub1category = DB::table('sub1categories')
                ->where('maincategory', $request->maincategory)  
                ->offset($request->start)
                ->limit($request->length)
                ->orderBy('id', 'desc')
                ->get();
            }        
            return response()->json([      
                'data' => $sub1category
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
                    // $rules = [
                        //     'maincategory'=>'required',
                        //     'subcategory'=>'required|unique',
                        // ];
                        
                        $rules = [
                            'maincategory' => 'required',
                            'subcategory' =>  [
                                'required', 
                                Rule::unique('sub1categories')
                                ->where('subcategory', $request->subcategory)
                                ->where('maincategory', $request->maincategory)
                                ]
                            ];            
                            
                            //custom message for validation initiate.if not need custom message remove $mssage from validator method.
                            //if we not set custom message for any validation it message will pop as default from laravel
                            $messages = [
                                'maincategory.required' => 'Item is required to select', 
                                'subcategory.unique' => 'This category already available.Please try again',  
                                'subcategory.required' => 'Category is required',
                            ];
                            
                            //custom validation
                            $validator = Validator::make($request->all(),$rules,$messages);
                            
                            $errorsMsgObject = $validator->errors();
                            $allErrorMsgArray = array();
                            $globalErrorMsg = "";
                            $msgType = 0;
                            
                            //create model object
                            $sub1category = new Sub1category;
                            
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
                                $sub1category->create($request->all());                
                                $msgType = 1;
                                $globalErrorMsg = "Successfully Saved.";                                             
                            }
                            
                            return response()->json([
                                'msgType' => $msgType,
                                'message' => $globalErrorMsg,
                                'category' => $sub1category
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
                            * @param  \App\Models\Sub1category  $sub1category
                            * @return \Illuminate\Http\Response
                            */
                            public function show(Sub1category $sub1category)
                            {
                                $query = DB::table('sub1categories')
                                ->join('maincategories', 'sub1categories.maincategory', '=', 'maincategories.id')           
                                ->select('sub1categories.*', 'maincategories.category as maincatname')
                                ->where('sub1categories.id', $sub1category->id) 
                                ->get();
                                return response()->json($query);
                                //return $sub1category;
                            }
                            
                            /**
                            * Update the specified resource in storage.
                            *
                            * @param  \Illuminate\Http\Request  $request
                            * @param  \App\Models\Sub1category  $sub1category
                            * @return \Illuminate\Http\Response
                            */
                            public function update(Request $request, Sub1category $sub1category)
                            {
                                try {
                                    //validation rules initiate
                                    // $rules = [
                                        //     'maincategory'=>'required',
                                        //     'subcategory'=>'required|unique:sub1categories,subcategory',
                                        // ];
                                        $rules = [
                                            'maincategory' => 'required',
                                            'subcategory' => 'required',
                                        ]; 
                                        
                                        //custom message for validation initiate.if not need custom message remove $mssage from validator method.
                                        //if we not set custom message for any validation it message will pop as default from laravel
                                        $messages = [
                                            'maincategory.required' => 'Item is required to select', 
                                            // 'subcategory.unique' => 'This sub category already available.Please try again',  
                                            'subcategory.required' => 'Category is required'
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
                                            $sub1category->update($request->all());
                                            $msgType = 1;
                                            $globalErrorMsg = "Successfully Updated.";                                             
                                        }
                                        
                                        return response()->json([
                                            'msgType' => $msgType,
                                            'message' => $globalErrorMsg,
                                            'category' => $sub1category
                                            ]); 
                                            
                                        } catch (\Throwable $th) {
                                            $message = "";
                                            switch ($th->errorInfo[1]) {
                                                case 1062://dublicate entry 
                                                    $message = 'Category can not be duplicate.';
                                                    break;
                                                    default:// you can handel any auther error
                                                        $message =$th->getMessage();
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
                                                * @param  \App\Models\Sub1category  $sub1category
                                                * @return \Illuminate\Http\Response
                                                */
                                                public function destroy(Sub1category $sub1category)
                                                {
                                                    try {
                                                        $sub1category->delete();
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
                                                    
                                                    