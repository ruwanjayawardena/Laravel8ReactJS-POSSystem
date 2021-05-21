<?php

namespace App\Http\Controllers;

use App\Models\Sub2category;
// use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class Sub2categoryController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $sub2category = Sub2category::all();
        return response()->json([
            'data' => $sub2category
            ]);
        }
        
        //Load Sub 2 category combo box
        public function cmbSub2Category(Request $request){
            $sub2categories = DB::table('sub2categories')
            ->where('sub1category', $request->id)            
            ->orderBy('id', 'asc')
            ->get();
            return response()->json($sub2categories);
        }
        
        //get Sub 1 category datatable friendly formated data
        public function getDataTableFilterData(Request $request){
            
            if($request->search['value'] != null){
                $sub2category = DB::table('sub2categories')
                ->where('sub1category', $request->sub1category)
                ->where('sub2category', 'LIKE', '%'.$request->search['value'].'%')            
                ->offset($request->start)
                ->limit($request->length)
                ->orderBy('id', 'desc')
                ->get();
            }else{            
                $sub2category = DB::table('sub2categories')
                ->where('sub1category', $request->sub1category)  
                ->offset($request->start)
                ->limit($request->length)
                ->orderBy('id', 'desc')
                ->get();
            }        
            return response()->json([      
                'data' => $sub2category
                ]);
            }
            
            public function getNextSub2CategoriesID(){  
                
                $id = DB::select(DB::raw('(SELECT `AUTO_INCREMENT`
                FROM  INFORMATION_SCHEMA.TABLES
                WHERE TABLE_SCHEMA = "'.DB::getDatabaseName().'"
                AND   TABLE_NAME   = "sub2categories")'));
                $next_id= $id[0]->AUTO_INCREMENT;
                // echo ""
                // return response(['product_id'=>$next_id]);                
                return $next_id;                
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
                    $rules = [
                        'sub1category' => 'required',
                        'sub2category' =>  [
                            'required', 
                            Rule::unique('sub2categories')
                            ->where('sub2category', $request->sub2category)
                            ->where('sub1category', $request->sub1category)
                            ]
                        ];            
                        
                        //custom message for validation initiate.if not need custom message remove $mssage from validator method.
                        //if we not set custom message for any validation it message will pop as default from laravel
                        $messages = [
                            'sub1category.required' => 'Main Category is required to select', 
                            'sub2category.unique' => 'This Category already available.Please try again',  
                            'sub2category.required' => 'Category is required',
                        ];
                        
                        //custom validation
                        $validator = Validator::make($request->all(),$rules,$messages);
                        
                        $errorsMsgObject = $validator->errors();
                        $allErrorMsgArray = array();
                        $globalErrorMsg = "";
                        $msgType = 0;
                        
                        //create model object
                        $sub2category = new sub2category;
                        
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
                            return response()->json([
                                'msgType' => 0,
                                'message' => $globalErrorMsg              
                                ]);
                                
                                
                            }else{
                                //validation ok success message                 
                                DB::beginTransaction();                            
                                $sub2category_id = $this->getNextSub2CategoriesID();
                                $affectedCategorySave = DB::table('sub2categories')->insert([
                                    'sub1category' => $request->sub1category,
                                    'sub2category' => $request->sub2category                
                                    ]);
                                    if($affectedCategorySave){                                    
                                        $productCodeQuery = DB::table('sub2categories')
                                        ->select(DB::raw('CONCAT(maincategories.code,sub2categories.sub1category,"'.$sub2category_id.'","-",((SELECT `AUTO_INCREMENT`
                                        FROM  INFORMATION_SCHEMA.TABLES
                                        WHERE TABLE_SCHEMA = "'.DB::getDatabaseName().'"
                                        AND   TABLE_NAME   = "products"))) AS product_code'))
                                        ->join('sub1categories',  'sub2categories.sub1category','=','sub1categories.id')
                                        ->join('maincategories',  'sub1categories.maincategory','=','maincategories.id')  
                                        ->limit(1)                              
                                        ->get();
                                        //validation ok success message
                                        $affectedProductSave =DB::table('products')->insert([
                                            'maincategory' => $request->maincategory,
                                            'sub1category' => $request->sub1category,
                                            'sub2category' => $sub2category_id,
                                            'product_code' => $productCodeQuery[0]->product_code,
                                            'product' => $request->maincategory_name,                                        
                                            'description'=>'Automatically created item',                    
                                            'outlet'=>1                     
                                            ]);
                                            if($affectedProductSave){
                                                DB::commit();
                                                $msgType = 1;
                                                $globalErrorMsg = "Successfully Saved.";
                                            }else{
                                                DB::rollBack();
                                                $msgType = 0;
                                                $globalErrorMsg = "Saving Failed... Try again later";
                                            }
                                        }else{
                                            DB::rollBack();
                                            $msgType = 0;
                                            $globalErrorMsg = "Saving Failed... Try again later";
                                        }
                                        return response()->json([
                                            'msgType' => $msgType,
                                            'message' => $globalErrorMsg,
                                            'category' => $sub2category
                                            ]); 
                                            
                                        }
                                    } catch (\Throwable $th) {
                                        return response()->json([
                                            'msgType' => 0,
                                            'message' => $th->getMessage()               
                                            ]);
                                        } 
                                        //end of trycatch                                
                                    }
                                    
                                    /**
                                    * Display the specified resource.
                                    *
                                    * @param  \App\Models\sub2category  $sub2category
                                    * @return \Illuminate\Http\Response
                                    */
                                    public function show(sub2category $sub2category)
                                    {
                                        $query = DB::table('sub2categories')
                                        ->join('sub1categories', 'sub2categories.sub1category', '=', 'sub1categories.id')           
                                        ->select('sub2categories.*', 'sub1categories.subcategory as sub1catname')
                                        ->where('sub2categories.id', $sub2category->id) 
                                        ->get();
                                        return response()->json($query);
                                    }
                                    
                                    /**
                                    * Update the specified resource in storage.
                                    *
                                    * @param  \Illuminate\Http\Request  $request
                                    * @param  \App\Models\sub2category  $sub2category
                                    * @return \Illuminate\Http\Response
                                    */
                                    public function update(Request $request, sub2category $sub2category)
                                    {
                                        try {
                                            $rules = [
                                                'sub1category' => 'required',
                                                'sub2category' =>  'required',
                                            ]; 
                                            
                                            //custom message for validation initiate.if not need custom message remove $mssage from validator method.
                                            //if we not set custom message for any validation it message will pop as default from laravel
                                            $messages = [
                                                'sub1category.required' => 'Main Category is required to select', 
                                                'sub2category.unique' => 'This category already available.Please try again',  
                                                'sub2category.required' => 'Category 2 is required'
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
                                                $sub2category->update($request->all());
                                                $msgType = 1;
                                                $globalErrorMsg = "Successfully Updated.";                                             
                                            }
                                            
                                            return response()->json([
                                                'msgType' => $msgType,
                                                'message' => $globalErrorMsg,
                                                'category' => $sub2category
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
                                                * @param  \App\Models\sub2category  $sub2category
                                                * @return \Illuminate\Http\Response
                                                */
                                                public function destroy(sub2category $sub2category)
                                                {
                                                    try {
                                                        $sub2category->delete();
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
                                                    