<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\BillItems;
use App\Models\Customer;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class BillController extends Controller
{
    /**
    * Display a listing of the resource.
    *
    * @return \Illuminate\Http\Response
    */
    public function index(Request $request)
    {
        if($request->start_date == "" || $request->end_date == ""){
            
            $cur_date  = date("Y-m-d").' 00:00:00';         
            $cur_date_mod  = date("Y-m-d").' 23:59:00';
            // echo $cur_date;
            // echo $cur_date_mod;
            $query = DB::table('bills') 
            ->select('bills.*',DB::raw('LPAD(bills.id, 5, 0) as bill_no')) 
            ->whereBetween('bl_created_at', [$cur_date, $cur_date_mod])     
            ->offset($request->start)
            ->limit($request->length)
            ->orderBy('id', 'desc')
            ->get();
        }else{
            $start_date_modified = $request->start_date.' 00:00:00';
            $end_date_modified =  $request->end_date.' 23:59:00';
            if($request->search['value'] != null){    
                $query = DB::table('bills') 
                ->select('bills.*',DB::raw('LPAD(bills.id, 5, 0) as bill_no')) 
                ->whereBetween('bl_created_at', [$start_date_modified, $end_date_modified])        
                ->orwhere('id', 'LIKE', '%'.$request->search['value'].'%')       
                ->offset($request->start)
                ->limit($request->length)
                ->orderBy('id', 'desc')
                ->get();
            }else{
                $query = DB::table('bills') 
                ->select('bills.*',DB::raw('LPAD(bills.id, 5, 0) as bill_no')) 
                ->whereBetween('bl_created_at', [$start_date_modified, $end_date_modified])        
                ->offset($request->start)
                ->limit($request->length)
                ->orderBy('id', 'desc')
                ->get();
            }
        }
        return response()->json([      
            'data' => $query
            ]);
        }
        
        
        public function billCancel($id)
        {
            try {
                $msgType = 0;
                $globalErrorMsg = "Sorry bill cancellation failed.";
                
                DB::beginTransaction();
                
                $billedItems = DB::table('bill_items')  
                ->where('bitm_bill', $id)
                ->get();
                
                $updateExistingItems = false;
                foreach ($billedItems as $blItems) {
                    //check both [][] and 1st find value and if not insert have update
                    $updateExistingItems = DB::table('products')
                    ->where('id',$blItems->bitm_item)
                    ->increment('qty',$blItems->bitm_qty);
                } 
                
                if($updateExistingItems){
                    $updateBillStatus = DB::table('bills')
                    ->where('id',$id)
                    ->update([
                        'bl_status' => 0,                            
                        ]); 

                        if($updateBillStatus){
                            //success
                            DB::commit();
                            $msgType = 1;
                            $globalErrorMsg = "Successfully cancelled"; 
                        }else{
                            DB::rollBack();
                        }
                    }else{
                        DB::rollBack();
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
            * Show the form for creating a new resource.
            *
            * @return \Illuminate\Http\Response
            */
            public function getBillInfoByBill($id)
            {
                $query = DB::table('bills') 
                ->select('bills.*',DB::raw('LPAD(bills.id, 5, 0) as bill_no')) 
                ->where('id', $id)
                ->orderBy('id', 'desc')
                ->get();
                return response()->json($query);
            }
            
            public function changeAuth($id){
                try {                
                    $affected = DB::table('bills')
                    ->where('id',$id)
                    ->update([
                        'bl_auth_status' => 1                           
                        ]); 
                        
                        if($affected){
                            return response()->json([
                                'msgType' => 1,             
                                'message' => 'Bill marked as successfully checked'               
                                ]
                            ); 
                        }else{
                            return response()->json([
                                'msgType' => 0,             
                                'message' => 'Marking Failed, Try again later'               
                                ]
                            ); 
                        }
                        
                    } catch (\Throwable $th) {
                        return response()->json([
                            'msgType' => 0,
                            'messageLine' => $th->getLine(),               
                            'message' => $th->getMessage()               
                            ]
                        );
                    }
                    
                }
                
                public function getBillItemsByBill($id)
                {
                    $query = DB::table('bill_items') 
                    ->join('products',  'bill_items.bitm_item','=','products.id')
                    ->join('sub2categories',  'products.sub2category','=','sub2categories.id')
                    ->join('sub1categories',  'products.sub1category','=','sub1categories.id')
                    ->join('maincategories',  'products.maincategory','=','maincategories.id')
                    ->select(
                        'bill_items.*',
                        'products.product',
                        'products.product_code',
                        'sub2categories.sub2category',
                        'sub1categories.subcategory',
                        'maincategories.category'
                        ) 
                        ->where('bill_items.bitm_bill', $id)
                        ->orderBy('bill_items.id', 'asc')
                        ->get();
                        
                        return response()->json($query);
                    }
                    
                    public function getBillCustomerByBill($id)
                    {
                        $query = DB::table('payments') 
                        ->select(DB::raw('IF(ISNULL(payments.py_customer),"Not Specified",(SELECT
                        CONCAT_WS(" -  ",customers.cus_name,customers.cus_contact_no,customers.cus_address)
                        FROM
                        customers
                        WHERE
                        customers.id = payments.py_customer)) AS customer_info')) 
                        ->where('payments.py_bill', $id)
                        ->get();
                        return response()->json($query);
                    }
                    
                    public function rules($request){
                        $rules = [
                            'bl_net_total'=> 'required|numeric',
                            'bl_discount_total'=> 'required|numeric',
                            'bl_paid_total'=> 'required|numeric',
                            'bl_balance_due'=> 'required|numeric',
                            'bl_note'=>'required',          
                        ];
                        return $rules; 
                    }
                    
                    /**
                    * Custom Validation Messages        
                    */     
                    public function messages(){
                        $messages = [ 
                            'bl_net_total.required' => 'Net total field is required',             
                            'bl_net_total.numeric' => 'Net total field value should in currency format',             
                            'bl_discount_total.required' => 'Discount field is required',             
                            'bl_discount_total.numeric' => 'Discount field value should in currency format',             
                            'bl_paid_total.required' => 'Total paid field is required',
                            'bl_paid_total.numeric' => 'Total paid field value should in currency format',
                            'bl_balance_due.required' => 'Balance due field is required',            
                            'bl_balance_due.numeric' => 'Balance due field value should in currency format',            
                            'bl_note.required' => 'Note is required',
                        ];        
                        return $messages;
                    } 
                    
                    public function getNextBillID(){  
                        
                        $id = DB::select(DB::raw('(SELECT `AUTO_INCREMENT`
                        FROM  INFORMATION_SCHEMA.TABLES
                        WHERE TABLE_SCHEMA = "'.DB::getDatabaseName().'"
                        AND   TABLE_NAME   = "bills")'));
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
                            $billID = "";         
                            
                            
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
                                //0 -cancelled bill, 1 - completed bill , 2 - Partially completed bill(uncompleted)
                                DB::beginTransaction();
                                
                                //Model object
                                $bill = new Bill;
                                $billItemsModal = new BillItems;
                                $customer = new Customer;
                                $payment = new Payment;
                                
                                $bl_status = 1;
                                if($request->bl_balance_due > 0){
                                    $bl_status = 2;
                                } 
                                
                                $billID = $this->getNextBillID();
                                //save bill table
                                $affectedBillTable = $bill->create([
                                    'bl_outlet'=> 1,      
                                    'bl_net_total' => $request->bl_net_total,
                                    'bl_discount_total' => $request->bl_discount_total,
                                    'bl_paid_total' => $request->bl_paid_total,
                                    'bl_balance_due' => $request->bl_balance_due,
                                    'bl_note' => $request->bl_note,
                                    'bl_status'=> $bl_status
                                    ]);
                                    if($affectedBillTable){
                                        //save bill item table
                                        $billItemArray = [];
                                        $billItems = $request->billItemArray;
                                        // echo $billItems;
                                        $affectedPaymentTable = false;
                                        foreach ($billItems as $bitm_key => $bitm) {
                                            $affectedPaymentTable = $billItemsModal->create([
                                                'bitm_bill' => $billID,        
                                                'bitm_item'=> $bitm['bitm_item'],
                                                'bitm_qty'=> $bitm['bitm_qty'],
                                                'bitm_sold_price'=> $bitm['bitm_sold_price'],
                                                'bitm_subtotal'=> $bitm['bitm_subtotal']
                                                ]);
                                            }
                                            
                                            if($affectedPaymentTable){
                                                //save user payment 
                                                $paymentArray = [];  
                                                //0 -cancelled payment, 1 - completed payment
                                                if($request->chkCustomerSelect == 0){
                                                    $paymentArray = [
                                                        'py_bill' => $billID, 
                                                        'py_pay_type' => $request->py_pay_type,
                                                        'py_paid_total' => $request->bl_paid_total,
                                                        'py_chq_info' => $request->py_chq_info,
                                                        'py_status' => 1
                                                    ];
                                                } else{
                                                    $paymentArray = [
                                                        'py_bill' => $billID,    
                                                        'py_customer'=> $request->py_customer,
                                                        'py_pay_type' => $request->py_pay_type,
                                                        'py_paid_total' => $request->bl_paid_total,
                                                        'py_chq_info' => $request->py_chq_info,
                                                        'py_status' => 1
                                                    ];
                                                }                      
                                                $affectedBillItemsTable = $payment->create($paymentArray);
                                                if($affectedPaymentTable){
                                                    //Update Qty
                                                    $updateStockQty = false;
                                                    foreach ($billItems as $bitm_key => $bitm) {
                                                        $updateStockQty = DB::table('products')
                                                        ->where('id',$bitm['bitm_item'])
                                                        ->where('qty','>=',$bitm['bitm_qty'])
                                                        ->decrement('qty',$bitm['bitm_qty']);  
                                                    }
                                                    
                                                    if($updateStockQty){
                                                        DB::commit();
                                                        $msgType = 1;
                                                        $globalErrorMsg = "Issuing bill successed"; 
                                                    }else{
                                                        DB::rollBack();
                                                        $msgType = 0;
                                                        $globalErrorMsg = "Billing Failed... Try again later BILLPRODUCT";  
                                                    }
                                                    
                                                }else{
                                                    DB::rollBack();
                                                    $msgType = 0;
                                                    $globalErrorMsg = "Billing Failed... Try again later BILLPAYMENT"; 
                                                }
                                            }else{
                                                DB::rollBack();
                                                $msgType = 0;
                                                $globalErrorMsg = "Billing Failed... Try again later BILLITEMS";
                                            }
                                        }else{
                                            DB::rollBack();
                                            $msgType = 0;
                                            $globalErrorMsg = "Billing Failed... Try again later BILL";
                                        }
                                        // $msgType = 1;
                                        // $globalErrorMsg = "Successfully Saved.";                                             
                                    }            
                                    return response()->json([
                                        'msgType' => $msgType,
                                        'message' => $globalErrorMsg,
                                        'billID' => $billID
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
                            * @param  \App\Models\Bill  $bill
                            * @return \Illuminate\Http\Response
                            */
                            public function show(Bill $bill)
                            {
                                //
                            }
                            
                            /**
                            * Show the form for editing the specified resource.
                            *
                            * @param  \App\Models\Bill  $bill
                            * @return \Illuminate\Http\Response
                            */
                            public function edit(Bill $bill)
                            {
                                //
                            }
                            
                            /**
                            * Update the specified resource in storage.
                            *
                            * @param  \Illuminate\Http\Request  $request
                            * @param  \App\Models\Bill  $bill
                            * @return \Illuminate\Http\Response
                            */
                            public function update(Request $request, Bill $bill)
                            {
                                //
                            }
                            
                            /**
                            * Remove the specified resource from storage.
                            *
                            * @param  \App\Models\Bill  $bill
                            * @return \Illuminate\Http\Response
                            */
                            public function destroy(Bill $bill)
                            {
                                //
                            }
                        }
                        