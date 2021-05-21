<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index(Request $request){   
        if($request->search['value'] != null){    
            $query = DB::table('products')
            ->join('maincategories',  'products.maincategory','=','maincategories.id')
            ->join('sub1categories',  'products.sub1category','=','sub1categories.id')
            ->join('sub2categories',  'products.sub2category','=','sub2categories.id')
            ->select('maincategories.category',
            'maincategories.code',
            'sub1categories.subcategory',
            'products.product',
            'products.product_code',
            'sub2categories.sub2category',
            'products.qty',
            'products.price',
            'products.wholesale_price',
            'products.description',
            'products.updated_at',
            'products.id')
            ->where('products.product', 'LIKE', '%'.$request->search['value'].'%')            
            ->orwhere('products.product_code', 'LIKE', '%'.$request->search['value'].'%')            
            ->orwhere('maincategories.category', 'LIKE', '%'.$request->search['value'].'%')            
            ->orwhere('sub2categories.sub2category', 'LIKE', '%'.$request->search['value'].'%')            
            ->orwhere('sub1categories.subcategory', 'LIKE', '%'.$request->search['value'].'%')            
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }else{
            $query = DB::table('products')
            ->join('maincategories',  'products.maincategory','=','maincategories.id')
            ->join('sub1categories',  'products.sub1category','=','sub1categories.id')
            ->join('sub2categories',  'products.sub2category','=','sub2categories.id')
            ->select('maincategories.category',
            'maincategories.code',
            'sub1categories.subcategory',
            'products.product',
            'products.product_code',
            'sub2categories.sub2category',
            'products.qty',
            'products.price',
            'products.wholesale_price',
            'products.description',
            'products.updated_at',
            'products.id')           
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }
        return response()->json([      
            'data' => $query
            ]);
        }
        
        public function cmbProducts(Request $request){
            $sub2categories = DB::table('products')
            ->where('sub2category', $request->id)
            ->get();
            return response()->json($sub2categories);
        }
        
        public function getImagePath(){      
            // Storage::setVisibility('products/em9qI2Gwlremm1u6kNfrYCty1K9jYtXyw146MOyt.jpg', 'public');     
            $url = Storage::url('products/2MqmYZ1CLUdWFTB2EwmVwcTPpaYzqPBD6FUO4y4v.jpg');
            echo asset($url);
        }
        
        public function updateProductImage(Request $request){
            $msgType = 0;
            $message = "";
            if(isset($request->product_image)){
                try {
                    //image validation
                    $request->validate([ 'product_image' => 'required|image|mimes:jpeg,png,jpg|max:512KB']);                    
                    $file = $request->product_image;                
                    $path = $file->store('public/products');
                    
                    $get_prev_image_query = DB::table('products')
                    ->select('product_image')
                    ->where('id', $request->id)
                    ->get();
                    
                    $pre_image = $get_prev_image_query[0]->product_image;
                    
                    if($pre_image != null && $pre_image != ""){
                        Storage::delete('public/products/'.$pre_image);
                    }
                    
                    $affected_update = DB::table('products')
                    ->where('id', $request->id)
                    ->update(['product_image' => $file->hashName()]);
                    
                    $msgType = 1;
                    $message = 'Successfully Uploaded.';                       
                    
                } catch (\Throwable $th) {
                    $message = 'Uploading faild, Try again later.';                            
                }
            }else{
                $message = "Please select an image for upload!";                            
            }   
            return response()->json([
                'msgType' => $msgType,
                'message' => $message
                ]);   
            }
            
            //image upload        
            public function uploadImage(Request $request)
            { 
                
                //image validation
                $request->validate([
                    'product_image' => 'required|image|mimes:jpeg,png,jpg|max:512KB',
                    ]);
                    
                    $file = $request->product_image;
                    //upload file name
                    //$file->hashName();
                    //upload file extention
                    // $extension = $file->extension();
                    //upload file path store(<folder path of inside storage folder >)
                    $path = $file->store('public/products');
                    // php artisan storage:link this command will copy my public forlder images to app/public/storage folder
                    //after complete app need to run above command to sycn
                    // Storage::putFile('public/products', $file, 'public'); 
                    return $file->hashName();               
                }
                
                //get Sub 1 category datatable friendly formated data
                public function getDataTableFilterData(Request $request){
                    
                    if($request->search['value'] != null){
                        $products = DB::table('products')
                        ->where('sub2category', $request->sub2category)
                        ->where('name', 'LIKE', '%'.$request->search['value'].'%')            
                        ->offset($request->start)
                        ->limit($request->length)
                        ->orderBy('id', 'desc')
                        ->get();
                    }else{            
                        $products = DB::table('products')
                        ->where('sub2category', $request->sub2category)  
                        ->offset($request->start)
                        ->limit($request->length)
                        ->orderBy('id', 'desc')
                        ->get();
                    }        
                    return response()->json([      
                        'data' => $products
                        ]);
                    }
                    
                    public function rules($request){
                        $rules = [
                            'maincategory' => 'required',
                            'sub1category' => 'required',
                            'sub2category' => 'required',
                            'product_code' => 'required|unique:products,product_code',
                            // 'product_image' => 'required|image|mimes:jpeg,png,jpg|max:512KB',
                            // 'qty' => 'required',
                            // 'price' => 'required',
                            // 'wholesale_price' => 'required',
                            // 'last_sold_price' => 'required',
                            'description' => 'required',
                            'product' =>  [
                                'required', 
                                Rule::unique('products')
                                ->where('product_code', $request->product_code)
                                ->where('product', $request->product)
                                ]
                            ];
                            return $rules; 
                        }
                        
                        public function messages(){
                            $messages = [
                                'maincategory.required' => 'Main category is required', 
                                'sub1category.required' => 'Sub category is required', 
                                'sub2category.required' => 'Sub category 2 is required', 
                                'product_code.required' => 'Product code is required', 
                                'product_code.unique' => 'Product code already available', 
                                'product.required' => 'Product is required', 
                                'product.unique' => 'This product already available',  
                                // 'qty.required' => 'Quantity is required',
                                // 'price.required' => 'Selling Price is required',
                                // 'wholesale_price.required' => 'Wholesale price is required',
                                // 'last_sold_price.required' => 'Last sold price is required',
                                'description.required' => 'Product Description is required',
                            ];
                            
                            return $messages;
                        }
                        
                        public function rules_update($request){
                            $rules = [
                                // 'maincategory' => 'required',
                                // 'sub1category' => 'required',
                                // 'sub2category' => 'required',
                                // 'product_code' => 'required|unique:products,product_code',
                                // 'qty' => 'required',
                                // 'price' => 'required',
                                // 'wholesale_price' => 'required',
                                // 'last_sold_price' => 'required',
                                // 'product_image' => 'image|mimes:jpeg,png,jpg|max:512KB',
                                'description' => 'required',
                                'product' =>  [
                                    'required', 
                                    Rule::unique('products')
                                    ->where('product_code', $request->product_code)
                                    ->where('product', $request->product)
                                    ]
                                ];
                                return $rules; 
                            }
                            
                            public function messages_update(){
                                $messages = [
                                    // 'maincategory.required' => 'Main category is required', 
                                    // 'sub1category.required' => 'Sub category is required', 
                                    // 'sub2category.required' => 'Sub category 2 is required', 
                                    // 'product_code.required' => 'Product code is required', 
                                    // 'product_code.unique' => 'Product code already available', 
                                    'product.required' => 'Product is required', 
                                    'product.unique' => 'This product already available',  
                                    // 'qty.required' => 'Quantity is required',
                                    // 'price.required' => 'Selling Price is required',
                                    // 'wholesale_price.required' => 'Wholesale price is required',
                                    // 'last_sold_price.required' => 'Last sold price is required',
                                    'description.required' => 'Product Description is required',
                                ];
                                
                                return $messages;
                            }
                            
                            public function getNextAutoIncrementID(){                   
                                $id = DB::select("SHOW TABLE STATUS LIKE 'products'");
                                $next_id= $id[0]->Auto_increment;
                                // return response(['product_id'=>$next_id]);                
                                return response($next_id);                
                            }
                            
                            public function generateProductCode($sub2category){                               
                                $query = DB::table('sub2categories')
                                ->select(DB::raw('CONCAT(maincategories.code,sub2categories.sub1category,sub2categories.id,"-",((SELECT `AUTO_INCREMENT`
                                FROM  INFORMATION_SCHEMA.TABLES
                                WHERE TABLE_SCHEMA = "'.DB::getDatabaseName().'"
                                AND   TABLE_NAME   = "products"))) AS product_code'))
                                ->join('sub1categories',  'sub2categories.sub1category','=','sub1categories.id')
                                ->join('maincategories',  'sub1categories.maincategory','=','maincategories.id')
                                ->where('sub2categories.id', $sub2category)
                                ->get();
                                
                                // echo  json_encode($query);                             
                                return $query[0]->product_code;  
                            }
                            
                            public function automatedProductCreate($maincategory_name,$maincategory,$sub1category,$sub2category){
                                $query = DB::table('sub2categories')
                                ->select(DB::raw('CONCAT(maincategories.code,sub2categories.sub1category,sub2categories.id,"-",((SELECT `AUTO_INCREMENT`
                                FROM  INFORMATION_SCHEMA.TABLES
                                WHERE TABLE_SCHEMA = "'.DB::getDatabaseName().'"
                                AND   TABLE_NAME   = "products"))) AS product_code'))
                                ->join('sub1categories',  'sub2categories.sub1category','=','sub1categories.id')
                                ->join('maincategories',  'sub1categories.maincategory','=','maincategories.id')
                                ->where('sub2categories.id', $sub2category)
                                ->get();
                                //validation ok success message
                                try {
                                    $affected = $product->create([
                                        'maincategory' => $maincategory,
                                        'sub1category' => $sub1category,
                                        'sub2category' => $sub2category,
                                        'product_code' => $query[0]->product_code,
                                        'product' => $maincategory_name,                                        
                                        'description'=>'Automated Default Product From Item Categorization'                                        
                                        ]);  
                                        return $affected;
                                    } catch (\Throwable $th) {
                                        return false;  
                                    }                             
                                    
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
                                        //custom validation
                                        $validator = Validator::make(
                                            $request->all(),
                                            $this->rules($request),
                                            $this->messages()
                                        );
                                        $errorsMsgObject = $validator->errors();
                                        $allErrorMsgArray = array();
                                        $globalErrorMsg = "";
                                        $msgType = 0;
                                        
                                        //create model object
                                        $product = new Product;
                                        
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
                                            $product->create($request->all());                                              
                                            // $product->create($request->except(['qty', 'price','wholesale_price','last_sold_price'])); 
                                            if(isset($request->product_image)){
                                                $upload_file = $this->uploadImage($request);                                    
                                                $affected_update = DB::table('products')
                                                ->where('product_code', $request->product_code)
                                                ->update(['product_image' => $upload_file]);
                                            }
                                            $msgType = 1;
                                            $globalErrorMsg = "Successfully Saved.";                                             
                                        }
                                        
                                        return response()->json([
                                            'msgType' => $msgType,
                                            'message' => $globalErrorMsg,
                                            'category' => $product
                                            ]); 
                                            
                                        } catch (\Throwable $th) {
                                            return response()->json([
                                                'msgType' => 0,
                                                'messageLine' => $th->getLine(),               
                                                'message' => $th->getMessage()               
                                                ]);
                                            } 
                                        }
                                        
                                        /**
                                        * Display the specified resource.
                                        *
                                        * @param  \App\Models\Product  $product
                                        * @return \Illuminate\Http\Response
                                        */
                                        public function show(Product $product)
                                        {
                                            $query = DB::table('products')
                                            ->join('sub2categories', 'products.sub2category', '=', 'sub2categories.id')           
                                            ->join('sub1categories', 'products.sub1category', '=', 'sub1categories.id')           
                                            ->join('maincategories', 'products.maincategory', '=', 'maincategories.id')           
                                            ->select('products.*', 'sub2categories.sub2category AS sub2catname','sub1categories.subcategory AS sub1catname','maincategories.category AS maincatname','maincategories.code AS maincatcode')
                                            ->where('products.id', $product->id) 
                                            ->get();
                                            return response()->json($query);
                                        }
                                        
                                        public function updatePrices(Request $request){
                                            $rules = [
                                                'price' => 'required',
                                                'wholesale_price' => 'required',                                            
                                            ];
                                            $messages = [
                                                'price.required' => 'Selling Price is required',
                                                'wholesale_price.required' => 'Wholesale price is required',                                            
                                            ];                                        
                                            try {                                            
                                                //custom validation
                                                $validator = Validator::make(
                                                    $request->all(),
                                                    $rules,
                                                    $messages
                                                );
                                                
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
                                                    DB::table('products')
                                                    ->where('id',$request->id)
                                                    ->update([
                                                        'price' => $request->price,                            
                                                        'wholesale_price' => $request->wholesale_price,                            
                                                        ]); 
                                                        $msgType = 1;
                                                        $globalErrorMsg = "Successfully Updated.";                                             
                                                    }
                                                    
                                                    return response()->json([
                                                        'msgType' => $msgType,
                                                        'message' => $globalErrorMsg
                                                        ]); 
                                                        
                                                    } catch (\Throwable $th) {
                                                        return response()->json([
                                                            'msgType' => 0,
                                                            'message' => $th->getMessage()               
                                                            ]);
                                                        }  
                                                    }
                                                    
                                                    /**
                                                    * Update the specified resource in storage.
                                                    *
                                                    * @param  \Illuminate\Http\Request  $request
                                                    * @param  \App\Models\Product $product
                                                    * @return \Illuminate\Http\Response
                                                    */
                                                    public function update(Request $request, Product $product)
                                                    {
                                                        try {                                            
                                                            //custom validation
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
                                                                $product->update($request->all());
                                                                $msgType = 1;
                                                                $globalErrorMsg = "Successfully Updated.";                                             
                                                            }
                                                            
                                                            return response()->json([
                                                                'msgType' => $msgType,
                                                                'message' => $globalErrorMsg,
                                                                'category' => $product
                                                                ]); 
                                                                
                                                            } catch (\Throwable $th) {
                                                                return response()->json([
                                                                    'msgType' => 0,
                                                                    'message' => $th->getMessage()               
                                                                    ]);
                                                                }            
                                                            }
                                                            
                                                            
                                                            /**
                                                            * Remove the specified resource from storage.
                                                            *
                                                            * @param  \App\Models\Product $product
                                                            * @return \Illuminate\Http\Response
                                                            */
                                                            public function destroy(Product $product)
                                                            {
                                                                try {
                                                                    $get_prev_image_query = DB::table('products')
                                                                    ->select('product_image')
                                                                    ->where('id', $product->id)
                                                                    ->get();
                                                                    
                                                                    $pre_image = $get_prev_image_query[0]->product_image;                                                    
                                                                    
                                                                    if($pre_image != null && $pre_image != ""){
                                                                        Storage::delete('public/products/'.$pre_image);
                                                                    }                                                    
                                                                    $product->delete();
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
                                                                