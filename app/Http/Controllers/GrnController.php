<?php

namespace App\Http\Controllers;

use App\Models\Grn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class GrnController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $supplier = Grn::all();
        return response()->json([
            'data' => $supplier
            ]
        );
    } 
    
    public function test(){
        $affectedReturnGRN = DB::table('returngrns')->insertOrIgnore(
            [
                ['grn' => 9,
                'return_note' => 'Partially Stocked Product Returned',
                'status' => 1]                        
                ]
            );
            if($affectedReturnGRN){
                echo "Success";
                print_r($affectedReturnGRN);
            }else{
                echo "Failed";
                print_r($affectedReturnGRN);
            }           
        }
        
        public function getStockStatusByReturnStockQty($product,$grn){
            $status = 0;
            $query = DB::table('returnstocks')
            ->select('returnstocks.qty AS returned_qty','stocks.qty')
            ->join('stocks', function ($join) {
                $join->on('returnstocks.product', '=', 'stocks.product')
                ->on('returnstocks.grn', '=', 'stocks.grn');
            })
            // ->join('stocks', 'returnstocks.product', '=', 'stocks.product')           
            // ->join('stocks', 'returnstocks.grn', '=', 'stocks.grn')           
            ->where('returnstocks.grn', $grn)
            ->where('returnstocks.product', $product)
            ->get(); 
            if($query[0]->returned_qty < $query[0]->qty){
                $status = 2;
            }else if($query[0]->returned_qty == $query[0]->qty){
                $status = 1;
            }
            return $status;
        }
        
        public function stocksFullReturnedStatusChanage($grn){
            $status = 0;
            $stocks = DB::table('stocks')
            ->where('grn', $grn)
            ->get(); 
            $stocks_full_returend = DB::table('stocks')
            ->where('grn', $grn)
            ->where('status',1)
            ->get(); 
            // echo $stocks->count();   
            // echo $stocks_full_returend->count();
            if($stocks->count() == $stocks_full_returend->count()){
                DB::table('grns')
                ->where('id',$grn)
                ->update([
                    'status' => 1                           
                    ]);
                    
                    DB::table('returngrns')
                    ->where('grn',$grn)
                    ->update([
                        'status' => 1                           
                        ]); 
                    }
                }
                
                public function returnPartialSingleStock(Request $request){
                    try {
                        $globalErrorMsg = "";
                        $msgType = 0;
                        $status = 2;
                        $affectedReturnGRN = false;                
                        
                        $getSelectedGRNStock = DB::table('stocks')
                        ->where('id', $request->stockID)
                        ->get();                
                        
                        DB::beginTransaction();
                        //1 - Full Returned , 2 - Partial Products Returned
                        DB::table('returngrns')->insertOrIgnore(
                            [
                                ['grn' => $getSelectedGRNStock[0]->grn,
                                'return_note' => 'Partially Stocked Product Returned',
                                'status' => $status]                        
                                ]
                            );
                            DB::table('grns')
                            ->where('id',$getSelectedGRNStock[0]->grn)
                            ->update([
                                'status' => $status                            
                                ]); 
                                
                                $updateReturnStock = false;
                                $updateStock = false;
                                $updateProduct = false;
                                if(!$getSelectedGRNStock->isEmpty()){
                                    foreach ($getSelectedGRNStock as $grnStockData) {
                                        //check both [][] and 1st find value and if not insert have update
                                        $updateReturnStock = DB::table('returnstocks')
                                        ->updateOrInsert(
                                            ['product' => $grnStockData->product,'grn' => $grnStockData->grn],
                                            ['return_note' => $request->return_note,'qty' => DB::raw('qty + '.$request->qty), 'status' => $status]                      
                                        ); 
                                    } 
                                    if($updateReturnStock){
                                        foreach ($getSelectedGRNStock as $grnStockData) {
                                            //if same value availabe will not update
                                            $stockStatus = $this->getStockStatusByReturnStockQty($grnStockData->product,$grnStockData->grn);
                                            
                                            $updateStock = DB::table('stocks')
                                            ->where('id',$grnStockData->id)
                                            ->update([
                                                'status' => $stockStatus,                            
                                                ]); 
                                                $updateReturnStock = DB::table('returnstocks')
                                                ->where('product',$grnStockData->product)
                                                ->where('grn',$grnStockData->grn)
                                                ->update([
                                                    'status' => $stockStatus,                            
                                                    ]);                                        
                                                    
                                                }  
                                                $this->stocksFullReturnedStatusChanage($grnStockData->grn);                                              
                                                // if($updateStock){
                                                    $lowQtyFlag = false;
                                                    foreach ($getSelectedGRNStock as $grnStockData) {
                                                        $availableQty = $this->getProductAvailableQty($grnStockData->product);
                                                        if($availableQty >= $request->qty){
                                                            $lowQtyFlag = true;
                                                            $updateProduct = DB::table('products')
                                                            ->where('id',$grnStockData->product)
                                                            ->where('qty','>=',$request->qty)
                                                            ->decrement('qty',$request->qty);
                                                        }else{
                                                            $updateProduct = false;
                                                            break;
                                                        }                                                       
                                                    }
                                                    if($updateProduct){                                                    
                                                        DB::commit();
                                                        $msgType = 1;
                                                        $globalErrorMsg = "Successfully Returned"; 
                                                    }else{
                                                        DB::rollBack();
                                                        $msgType = 0;
                                                        if($lowQtyFlag){
                                                            $globalErrorMsg = "Product Update Failed"; 
                                                        }else{
                                                            $globalErrorMsg = "Product Update Failed.Not Enaugh Qty for reverse.";
                                                        }
                                                    }
                                                    
                                                    // }else{
                                                        //     DB::rollBack();
                                                        //     $msgType = 0;
                                                        //     $globalErrorMsg = "Stock Data Update Failed";  
                                                        // }
                                                    }else{
                                                        DB::rollBack();
                                                        $msgType = 0;
                                                        $globalErrorMsg = "Return Stock Data not updated";  
                                                    }
                                                }else{
                                                    DB::rollBack();
                                                    $msgType = 0;
                                                    $globalErrorMsg = "Stock Data not available for returning...";  
                                                }
                                                
                                                return response()->json([
                                                    'msgType' => $msgType,
                                                    'message' => $globalErrorMsg
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
                                        
                                        
                                        public function returnFullSingleStock(Request $request){
                                            try {
                                                $globalErrorMsg = "";
                                                $msgType = 0;
                                                $status = 2;
                                                $affectedReturnGRN = false;                
                                                
                                                $getSelectedGRNStock = DB::table('stocks')
                                                ->where('id', $request->stockID)
                                                ->get();                
                                                
                                                DB::beginTransaction();
                                                //1 - Full Returned , 2 - Partial Products Returned
                                                DB::table('returngrns')->insertOrIgnore(
                                                    [
                                                        ['grn' => $getSelectedGRNStock[0]->grn,
                                                        'return_note' => 'Partially Stocked Product Returned',
                                                        'status' => $status]                        
                                                        ]
                                                    );
                                                    DB::table('grns')
                                                    ->where('id',$getSelectedGRNStock[0]->grn)
                                                    ->update([
                                                        'status' => $status                            
                                                        ]); 
                                                        
                                                        $updateReturnStock = false;
                                                        $updateStock = false;
                                                        $updateProduct = false;
                                                        if(!$getSelectedGRNStock->isEmpty()){
                                                            foreach ($getSelectedGRNStock as $grnStockData) {
                                                                
                                                                $updateReturnStock = DB::table('returnstocks')->insert([
                                                                    'product' => $grnStockData->product,
                                                                    'grn' => $grnStockData->grn,
                                                                    'qty' => $grnStockData->qty,                        
                                                                    'return_note' => $request->return_note,
                                                                    'status' => 1                        
                                                                    ]);
                                                                }
                                                                if($updateReturnStock){
                                                                    foreach ($getSelectedGRNStock as $grnStockData) {
                                                                        $updateStock = DB::table('stocks')
                                                                        ->where('id',$grnStockData->id)
                                                                        ->update([
                                                                            'status' => 1,                            
                                                                            ]);                                                    
                                                                        } 
                                                                        $this->stocksFullReturnedStatusChanage($grnStockData->grn);                                                 
                                                                        if($updateStock){
                                                                            $lowQtyFlag = false;
                                                                            foreach ($getSelectedGRNStock as $grnStockData) {
                                                                                $availableQty = $this->getProductAvailableQty($grnStockData->product);
                                                                                if($availableQty >= $grnStockData->qty){
                                                                                    $lowQtyFlag = true;
                                                                                    $updateProduct = DB::table('products')
                                                                                    ->where('id',$grnStockData->product)
                                                                                    ->where('qty','>=',$grnStockData->qty)
                                                                                    ->decrement('qty',$grnStockData->qty);
                                                                                }else{
                                                                                    $updateProduct = false;
                                                                                    break;
                                                                                }                                                       
                                                                            }
                                                                            if($updateProduct){
                                                                                DB::commit();
                                                                                $msgType = 1;
                                                                                $globalErrorMsg = "Successfully Returned"; 
                                                                            }else{
                                                                                DB::rollBack();
                                                                                $msgType = 0;
                                                                                if($lowQtyFlag){
                                                                                    $globalErrorMsg = "Product Update Failed"; 
                                                                                }else{
                                                                                    $globalErrorMsg = "Product Update Failed.Not Enaugh Qty for reverse.";
                                                                                }
                                                                            }
                                                                            
                                                                        }else{
                                                                            DB::rollBack();
                                                                            $msgType = 0;
                                                                            $globalErrorMsg = "Stock Data Update Failed";  
                                                                        }
                                                                    }else{
                                                                        DB::rollBack();
                                                                        $msgType = 0;
                                                                        $globalErrorMsg = "Return Stock Data not updated";  
                                                                    }
                                                                }else{
                                                                    DB::rollBack();
                                                                    $msgType = 0;
                                                                    $globalErrorMsg = "Stock Data not available for returning...";  
                                                                }
                                                                
                                                                return response()->json([
                                                                    'msgType' => $msgType,
                                                                    'message' => $globalErrorMsg
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
                                                        
                                                        
                                                        public function getProductAvailableQty($product){
                                                            $query = DB::table('products')
                                                            ->select('products.qty')
                                                            ->where('id', $product)
                                                            ->get();
                                                            return $query[0]->qty;        
                                                        }
                                                        
                                                        public function returnFullGrn(Request $request){        
                                                            try {
                                                                $globalErrorMsg = "";
                                                                $msgType = 0;
                                                                
                                                                $getSelectedGRN = DB::table('grns')
                                                                ->where('id', $request->grn)
                                                                ->get();
                                                                $getSelectedGRNStock = DB::table('stocks')
                                                                ->where('grn', $request->grn)
                                                                ->get();
                                                                
                                                                DB::beginTransaction();
                                                                
                                                                if(!$getSelectedGRN->isEmpty()){
                                                                    //1 - Full Returned , 2 - Partial Products Returned
                                                                    $status = 1;
                                                                    $affectedReturnGRN = DB::table('returngrns')->insert([
                                                                        'grn' => $request->grn,
                                                                        'return_note' => $request->return_note,
                                                                        'status' => $status                        
                                                                        ]);
                                                                        
                                                                        if($affectedReturnGRN){                       
                                                                            $affectedUpdateGRN =  $affectedProduct = DB::table('grns')
                                                                            ->where('id',$request->grn)
                                                                            ->update([
                                                                                'status' => $status,                            
                                                                                ]);
                                                                                if($affectedUpdateGRN){
                                                                                    // $msgType = 1;
                                                                                    // $globalErrorMsg = "Successfully Returned"; 
                                                                                    $updateReturnStock = false;
                                                                                    $updateStock = false;
                                                                                    $updateProduct = false;
                                                                                    if(!$getSelectedGRNStock->isEmpty()){
                                                                                        foreach ($getSelectedGRNStock as $grnStockData) {
                                                                                            
                                                                                            $updateReturnStock = DB::table('returnstocks')->insert([
                                                                                                'product' => $grnStockData->product,
                                                                                                'grn' => $request->grn,
                                                                                                'qty' => $grnStockData->qty,                        
                                                                                                'return_note' => 'Due to GRN Stock Full Returned',
                                                                                                'status' => $status                        
                                                                                                ]);
                                                                                            }
                                                                                            if($updateReturnStock){
                                                                                                foreach ($getSelectedGRNStock as $grnStockData) {
                                                                                                    $updateStock = DB::table('stocks')
                                                                                                    ->where('id',$grnStockData->id)
                                                                                                    ->update([
                                                                                                        'status' => $status,                            
                                                                                                        ]);                                                    
                                                                                                    }                                                
                                                                                                    if($updateStock){
                                                                                                        $lowQtyFlag = false;
                                                                                                        foreach ($getSelectedGRNStock as $grnStockData) {
                                                                                                            $availableQty = $this->getProductAvailableQty($grnStockData->product);
                                                                                                            if($availableQty >= $grnStockData->qty){
                                                                                                                $lowQtyFlag = true;
                                                                                                                $updateProduct = DB::table('products')
                                                                                                                ->where('id',$grnStockData->product)
                                                                                                                ->where('qty','>=',$grnStockData->qty)
                                                                                                                ->decrement('qty',$grnStockData->qty);
                                                                                                            }else{
                                                                                                                $updateProduct = false;
                                                                                                                break;
                                                                                                            }                                                       
                                                                                                        }
                                                                                                        if($updateProduct){
                                                                                                            DB::commit();
                                                                                                            $msgType = 1;
                                                                                                            $globalErrorMsg = "Successfully Returned"; 
                                                                                                        }else{
                                                                                                            DB::rollBack();
                                                                                                            $msgType = 0;
                                                                                                            if($lowQtyFlag){
                                                                                                                $globalErrorMsg = "Product Update Failed"; 
                                                                                                            }else{
                                                                                                                $globalErrorMsg = "Product Update Failed.Not Enaugh Qty for reverse.";
                                                                                                            }
                                                                                                        }
                                                                                                        
                                                                                                    }else{
                                                                                                        DB::rollBack();
                                                                                                        $msgType = 0;
                                                                                                        $globalErrorMsg = "Stock Data Update Failed";  
                                                                                                    }
                                                                                                }else{
                                                                                                    DB::rollBack();
                                                                                                    $msgType = 0;
                                                                                                    $globalErrorMsg = "Return Stock Data not updated";  
                                                                                                }
                                                                                            }else{
                                                                                                DB::rollBack();
                                                                                                $msgType = 0;
                                                                                                $globalErrorMsg = "Stock Data not available for returning...";  
                                                                                            }
                                                                                        }else{
                                                                                            DB::rollBack();
                                                                                            $msgType = 0;
                                                                                            $globalErrorMsg = "GRN Update Failed";  
                                                                                        }   
                                                                                    }else{
                                                                                        DB::rollBack();
                                                                                        $msgType = 0;
                                                                                        $globalErrorMsg = "Returning GRN Data Failed";  
                                                                                    }                                
                                                                                }else{
                                                                                    DB::rollBack();
                                                                                    $msgType = 0;
                                                                                    $globalErrorMsg = "Selected GRN Data not available";  
                                                                                }
                                                                                
                                                                                return response()->json([
                                                                                    'msgType' => $msgType,
                                                                                    'message' => $globalErrorMsg
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
                                                                        
                                                                        
                                                                        public function getGrnStockProducts($id){
                                                                            
                                                                            $query = DB::table('stocks')
                                                                            ->join('products',  'stocks.product','=','products.id')
                                                                            ->select('stocks.id','stocks.product','stocks.grn','stocks.qty','stocks.selling_price','stocks.wholesale_price','stocks.stock_price','stocks.description','stocks.status','products.product_code','products.product as product_name','products.qty as product_qty',
                                                                            DB::raw('(stocks.qty - (SELECT
                                                                            IFNULL(returnstocks.qty,0)
                                                                            FROM
                                                                            returnstocks
                                                                            WHERE
                                                                            returnstocks.grn = stocks.grn AND
                                                                            returnstocks.product = stocks.product)) AS available_qty_for_return'),
                                                                            )
                                                                            ->where('stocks.grn', $id)          
                                                                            ->orderBy('stocks.grn', 'ASC')
                                                                            ->get();
                                                                            return response()->json($query);
                                                                        }
                                                                        
                                                                        public function getGrnReturnStockProducts($id){
                                                                            
                                                                            $query = DB::table('returnstocks')
                                                                            ->join('stocks', function ($join) {
                                                                                $join->on('stocks.product','=','returnstocks.product')
                                                                                ->on('stocks.grn', '=', 'returnstocks.grn');
                                                                            })
                                                                            ->join('products',  'stocks.product','=','products.id')
                                                                            ->select('stocks.id','stocks.product','stocks.grn','stocks.qty','stocks.selling_price','stocks.wholesale_price','stocks.stock_price','stocks.description','stocks.status','products.product_code','products.product as product_name','products.qty as product_qty','returnstocks.return_note','returnstocks.qty AS returned_qty','returnstocks.updated_at AS returnstock_updated_at',
                                                                            DB::raw('(stocks.qty - (SELECT
                                                                            IFNULL(returnstocks.qty,0)
                                                                            FROM
                                                                            returnstocks
                                                                            WHERE
                                                                            returnstocks.grn = stocks.grn AND
                                                                            returnstocks.product = stocks.product)) AS available_qty_for_return'),
                                                                            )
                                                                            ->where('stocks.grn', $id)          
                                                                            ->orderBy('stocks.grn', 'ASC')
                                                                            ->get();
                                                                            return response()->json($query);
                                                                        }
                                                                        
                                                                        /**
                                                                        * Display a Filter Table Data
                                                                        *
                                                                        * @return \Illuminate\Http\Response
                                                                        */
                                                                        public function getDataTableReturnGrnFilterData(Request $request){
                                                                            if($request->search['value'] != null){
                                                                                $suppliers = DB::table('returngrns')
                                                                                ->join('grns',  'grns.id','=','returngrns.grn')
                                                                                ->join('suppliers',  'grns.supplier','=','suppliers.id')
                                                                                ->select('grns.id',
                                                                                'grns.supplier',
                                                                                'grns.reference_no',
                                                                                'grns.total',
                                                                                'grns.description',
                                                                                'returngrns.return_note',
                                                                                'grns.status',
                                                                                'grns.created_at',
                                                                                'grns.updated_at',
                                                                                'suppliers.name',
                                                                                'suppliers.contact_person',
                                                                                'suppliers.contact_no')
                                                                                ->where('grns.reference_no', 'LIKE', '%'.$request->search['value'].'%')            
                                                                                ->orWhere('grns.description', 'LIKE', '%'.$request->search['value'].'%')  
                                                                                ->orWhere('returngrns.description', 'LIKE', '%'.$request->search['value'].'%')  
                                                                                ->orWhere('suppliers.name', 'LIKE', '%'.$request->search['value'].'%')  
                                                                                ->orWhere('suppliers.contact_no', 'LIKE', '%'.$request->search['value'].'%')  
                                                                                ->orWhere('suppliers.contact_person', 'LIKE', '%'.$request->search['value'].'%')  
                                                                                ->offset($request->start)
                                                                                ->limit($request->length)
                                                                                ->orderBy('grns.id', 'desc')               
                                                                                ->get();           
                                                                            }else{
                                                                                $suppliers = DB::table('returngrns')            
                                                                                ->join('grns',  'grns.id','=','returngrns.grn')
                                                                                ->join('suppliers',  'grns.supplier','=','suppliers.id')
                                                                                ->select('grns.id',
                                                                                'grns.supplier',
                                                                                'grns.reference_no',
                                                                                'grns.total',
                                                                                'grns.description',
                                                                                'returngrns.return_note',
                                                                                'grns.status',
                                                                                'grns.created_at',
                                                                                'grns.updated_at',
                                                                                'suppliers.name',
                                                                                'suppliers.contact_person',
                                                                                'suppliers.contact_no')
                                                                                ->offset($request->start)
                                                                                ->limit($request->length)
                                                                                ->orderBy('grns.id', 'desc')          
                                                                                ->get();    
                                                                            }        
                                                                            return response()->json([      
                                                                                'data' => $suppliers
                                                                                ]
                                                                            );
                                                                        }
                                                                        
                                                                        
                                                                        
                                                                        public function getDataTableFilterData(Request $request)
                                                                        {                    
                                                                            if($request->search['value'] != null){
                                                                                $suppliers = DB::table('grns')
                                                                                ->join('suppliers',  'grns.supplier','=','suppliers.id')
                                                                                ->select('grns.id',
                                                                                'grns.supplier',
                                                                                'grns.reference_no',
                                                                                'grns.total',
                                                                                'grns.description',
                                                                                'grns.status',
                                                                                'grns.created_at',
                                                                                'grns.updated_at',
                                                                                'suppliers.name',
                                                                                'suppliers.contact_person',
                                                                                'suppliers.contact_no')
                                                                                ->where('grns.reference_no', 'LIKE', '%'.$request->search['value'].'%')            
                                                                                ->orWhere('grns.description', 'LIKE', '%'.$request->search['value'].'%')  
                                                                                ->orWhere('suppliers.name', 'LIKE', '%'.$request->search['value'].'%')  
                                                                                ->offset($request->start)
                                                                                ->limit($request->length)
                                                                                ->orderBy('grns.id', 'desc')               
                                                                                ->get();           
                                                                            }else{
                                                                                $suppliers = DB::table('grns')            
                                                                                ->join('suppliers',  'grns.supplier','=','suppliers.id')
                                                                                ->select('grns.id',
                                                                                'grns.supplier',
                                                                                'grns.reference_no',
                                                                                'grns.total',
                                                                                'grns.description',
                                                                                'grns.status',
                                                                                'grns.created_at',
                                                                                'grns.updated_at',
                                                                                'suppliers.name',
                                                                                'suppliers.contact_person',
                                                                                'suppliers.contact_no')
                                                                                ->offset($request->start)
                                                                                ->limit($request->length)
                                                                                ->orderBy('grns.id', 'desc')          
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
                                                                                'supplier' => 'required',
                                                                                'total' => 'required',
                                                                                'description' => 'required',
                                                                                'reference_no' =>  [
                                                                                    'required', 
                                                                                    Rule::unique('grns')
                                                                                    ->where('supplier', $request->supplier)
                                                                                    ->where('reference_no', $request->reference_no)
                                                                                    ]
                                                                                ];           
                                                                                
                                                                                return $rules; 
                                                                            }
                                                                            
                                                                            /**
                                                                            * Custom Validation Messages        
                                                                            */     
                                                                            public function messages(){
                                                                                $messages = [ 
                                                                                    'supplier.required' => 'Supplier is required',
                                                                                    'reference_no.required' => 'Reference Number is required',
                                                                                    'total.required' => 'Total is required',
                                                                                    'description.required' => 'Description is required',
                                                                                    'reference_no.unique' => 'This reference number already available under this supplier'  
                                                                                ];        
                                                                                return $messages;
                                                                            }
                                                                            
                                                                            public function getNextAutoIncrementID(){                   
                                                                                $id = DB::select("SHOW TABLE STATUS LIKE 'grns'");
                                                                                $next_id= $id[0]->Auto_increment;              
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
                                                                                    $grn = new Grn;
                                                                                    
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
                                                                                        
                                                                                        $grnID = $this->getNextAutoIncrementID();
                                                                                        
                                                                                        
                                                                                        $affectedGRN = DB::table('grns')->insert([
                                                                                            'supplier' => $request->supplier,
                                                                                            'reference_no' => $request->reference_no,
                                                                                            'total' => $request->total,
                                                                                            'description' => $request->description,
                                                                                            ]);                    
                                                                                            
                                                                                            if($affectedGRN){
                                                                                                $stockArray = $request->product_stock_array;
                                                                                                if(!empty($stockArray)){
                                                                                                    $affectedStock = false;
                                                                                                    foreach ($stockArray as $value) {
                                                                                                        $affectedStock = DB::table('stocks')->insert([
                                                                                                            'product' => $value['product'],
                                                                                                            'grn' => $grnID,
                                                                                                            'qty' => $value['qty'],
                                                                                                            'selling_price' => $value['selling_price'],
                                                                                                            'wholesale_price' => $value['wholesale_price'],
                                                                                                            'stock_price' => $value['stock_price'],
                                                                                                            'description' => $value['description']
                                                                                                            ]);                            
                                                                                                        }
                                                                                                        if($affectedStock){
                                                                                                            $affectedProduct = false;
                                                                                                            foreach ($stockArray as $value) {
                                                                                                                
                                                                                                                $affectedProduct = DB::table('products')
                                                                                                                ->where('id',$value['product'])
                                                                                                                ->increment('qty',$value['qty'],[
                                                                                                                    'price' => $value['selling_price'],
                                                                                                                    'wholesale_price' => $value['wholesale_price']
                                                                                                                    ]);                                              
                                                                                                                    // $affectedProduct = DB::table('products')
                                                                                                                    // ->where('id',$value['product'])
                                                                                                                    // ->increment('qty',$value['qty']);
                                                                                                                    // ->update([
                                                                                                                        //     'qty' => 'qty + ' + $value['qty'],
                                                                                                                        //     'price' => $value['selling_price'],
                                                                                                                        //     'wholesale_price' => $value['wholesale_price'],
                                                                                                                        //     ]); 
                                                                                                                    } 
                                                                                                                    
                                                                                                                    if($affectedProduct){
                                                                                                                        DB::commit();
                                                                                                                        $msgType = 1;
                                                                                                                        $globalErrorMsg = "Successfully Saved.";  
                                                                                                                    }else{
                                                                                                                        //Please select products for add stock
                                                                                                                        DB::rollBack();
                                                                                                                        $msgType = 0;
                                                                                                                        $globalErrorMsg = "Problem on upgrading Products Stocks..";  
                                                                                                                    }                                          
                                                                                                                    
                                                                                                                }else{
                                                                                                                    //Please select products for add stock
                                                                                                                    DB::rollBack();
                                                                                                                    $msgType = 0;
                                                                                                                    $globalErrorMsg = "Problem on saving GRN..";   
                                                                                                                }                                
                                                                                                            }else{
                                                                                                                //Please select products for add stock
                                                                                                                DB::rollBack();
                                                                                                                $msgType = 0;
                                                                                                                $globalErrorMsg = "Please select products for add stock.";   
                                                                                                            }                    
                                                                                                        }else{
                                                                                                            //saving process error on GRN Table
                                                                                                            DB::rollBack();
                                                                                                            $msgType = 0;
                                                                                                            $globalErrorMsg = "Problem on saving GRN Data.";   
                                                                                                        }                     
                                                                                                        
                                                                                                        
                                                                                                    }            
                                                                                                    return response()->json([
                                                                                                        'msgType' => $msgType,
                                                                                                        'message' => $globalErrorMsg
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
                                                                                            * @param  \App\Models\Grn $grn
                                                                                            * @return \Illuminate\Http\Response
                                                                                            */
                                                                                            public function show(Grn $grn)
                                                                                            {
                                                                                                $suppliers = DB::table('grns')            
                                                                                                ->join('suppliers',  'grns.supplier','=','suppliers.id')
                                                                                                ->select('grns.*', 'suppliers.*')
                                                                                                ->orderBy('grns.id', 'desc')          
                                                                                                ->get();    
                                                                                                
                                                                                                return response()->json([      
                                                                                                    'data' => $suppliers
                                                                                                    ]
                                                                                                );
                                                                                                return response()->json([
                                                                                                    $grn
                                                                                                    ]        
                                                                                                );
                                                                                            } 
                                                                                            
                                                                                            
                                                                                            /**
                                                                                            * Update the specified resource in storage.
                                                                                            *
                                                                                            * @param  \Illuminate\Http\Request  $request
                                                                                            * @param  \App\Models\Grn $grn
                                                                                            * @return \Illuminate\Http\Response
                                                                                            */
                                                                                            public function update(Request $request, Grn $grn)
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
                                                                                                        $grn->update($request->all());
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
                                                                                            * @param  \App\Models\Grn $grn
                                                                                            * @return \Illuminate\Http\Response
                                                                                            */
                                                                                            public function destroy(Grn $grn)
                                                                                            {
                                                                                                try {                                                              
                                                                                                    $grn->delete();
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
                                                                                        