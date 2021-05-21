<?php

namespace App\Http\Controllers;

use App\Models\Weather;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use DB;

class WeatherController extends Controller
{
    /**
    * Returning all the weather data.
    *
    * @return \Illuminate\Http\Response
    */
    public function index()
    {
        $weather = DB::table('weathers')
        ->orderBy('id', 'ASC')
        ->get();
        //return response()->json($weather,200);
        return $weather;
    }    
    
    /**
    * Returning all the weather data filter by the location coordinates.
    *
    * @return \Illuminate\Http\Response
    */
    public function filterByLatLon($lat,$lon)
    {
        $query = DB::table('weathers')
        ->where('location', 'LIKE', '%"lat":"'.$lat.'"%')
        ->orWhere('location', 'LIKE', '%"lon":"'.$lon.'"%')            
        ->orderBy('id', 'ASC')
        ->get();
        
        $weather_array = json_decode($query);
        $weather_jsonarray = array();        
        foreach($weather_array as $weatherkey => $weatherdata){
            $weather_jsonarray[$weatherkey]['id'] = $weatherdata->id;
            $weather_jsonarray[$weatherkey]['date'] = $weatherdata->date;
            $weather_jsonarray[$weatherkey]['location'] = json_decode($weatherdata->location);  
            $weather_jsonarray[$weatherkey]['temperature'] = json_decode($weatherdata->temperature);
        }
        return response()->json([      
            'data' => $weather_jsonarray
            ]);            
            
        }
        
        public function stringToDateFormat($date){
            $newdate = date('Y-m-d', strtotime($date));
            return $newdate;
        }
        
        public function filterByDate($startdate,$enddate)
        { 
            $query = DB::table('weathers')
            ->whereBetween('date', [$this->stringToDateFormat($startdate), $this->stringToDateFormat($enddate)])
            ->orderBy('id', 'ASC')
            ->get();
            
            $weather_array = json_decode($query);
            $weather_jsonarray = array();        
            foreach($weather_array as $weatherkey => $weatherdata){
                $weather_jsonarray[$weatherkey]['id'] = $weatherdata->id;
                $weather_jsonarray[$weatherkey]['date'] = $weatherdata->date;
                $weather_jsonarray[$weatherkey]['location'] = json_decode($weatherdata->location);  
                $weather_jsonarray[$weatherkey]['temperature'] = json_decode($weatherdata->temperature);
            }
            return response()->json([      
                'data' => $weather_jsonarray
                ]);            
                
            }
            
            public function filterTemperatureByLatLon($startDate,$endDate){
                $query = DB::table('weathers')
                ->whereBetween('date', [$this->stringToDateFormat($startDate), $this->stringToDateFormat($endDate)])
                ->orderBy('id', 'ASC')
                ->get();
                
                $weather_array = json_decode($query);
                $weather_jsonarray = array();        
                foreach($weather_array as $weatherkey => $weatherdata){
                    $weather_jsonarray[$weatherkey]['id'] = $weatherdata->id;
                    $weather_jsonarray[$weatherkey]['date'] = $weatherdata->date;
                    $weather_jsonarray[$weatherkey]['location'] = json_decode($weatherdata->location);  
                    $weather_jsonarray[$weatherkey]['temperature'] = json_decode($weatherdata->temperature);
                }
                return response()->json([      
                    'data' => $weather_jsonarray
                    ]);            
                    
                }
                
                
                //get datatable friendly formated data
                public function getDataTableFilterData(Request $request){
                    
                    if($request->search['value'] != null){
                        $weather = DB::table('weathers')            
                        ->where('location', 'LIKE', '%'.$request->search['value'].'%')            
                        ->orWhere('temperature', 'LIKE', '%'.$request->search['value'].'%')            
                        ->orWhere('date', 'LIKE', '%'.$request->search['value'].'%')            
                        ->offset($request->start)
                        ->limit($request->length)
                        ->orderBy('id', 'desc')
                        ->get();
                    }else{            
                        $weather = DB::table('weathers')             
                        ->offset($request->start)
                        ->limit($request->length)
                        ->orderBy('id', 'desc')
                        ->get();
                    }  
                    
                    $weather_array = json_decode($weather);
                    $weather_newarray = array();        
                    foreach($weather_array as $weatherkey => $weatherdata){
                        $weather_newarray[$weatherkey]['id'] = $weatherdata->id;
                        $weather_newarray[$weatherkey]['date'] = $weatherdata->date;
                        $weather_newarray[$weatherkey]['location'] = json_decode($weatherdata->location);  
                        $weather_newarray[$weatherkey]['temperature'] = json_decode($weatherdata->temperature);
                        // $location = json_decode($weatherdata->location, true);       
                        // $weather_newarray[$weatherkey]['lat'] = $location['lat'];
                        // $weather_newarray[$weatherkey]['lon'] = $location['lon'];
                        // $weather_newarray[$weatherkey]['city'] = $location['city'];
                        // $weather_newarray[$weatherkey]['state'] = $location['state'];
                    }
                    return response()->json([      
                        'data' => $weather_newarray
                        ]);
                    }        
                    
                    public function validationRules(){
                        //DEFINE VALIDATION RULES
                        $rules = [
                            'date' => 'required|date|date_format:Y-m-d',
                            'location' => 'required|array',
                            'temperature' => 'required|array'               
                        ]; 
                        return $rules;
                    }
                    
                    public function validationMessages(){
                        //DEFINE CUSTOM MESSAGE FOR VALIDATION RULES
                        $messages = [
                            'date.required' => 'Date is required', 
                            'date.date' => 'Date Field should be as a date format yyyy-mm-dd',  
                            'location.required' => 'Location is required',
                            'location.array'=>'Location should be Json array format',
                            'temperature.required' => 'Temperature is required',
                            'temperature.array'=>'temperature should be an 24 float values array'
                        ];
                        return $messages;
                    }
                    
                    /**
                    * Store a newly created weather data.
                    *
                    * @param  \Illuminate\Http\Request  $request
                    * @return \Illuminate\Http\Response
                    */
                    public function store(Request $request)
                    {
                        try {                
                            //CUSTOME VALIDATION
                            $validator = Validator::make($request->all(),$this->validationRules(),$this->validationMessages());
                            
                            $errorsMsgObject = $validator->errors();
                            $allErrorMsgArray = array();
                            $globalErrorMsg = "";
                            $msgType = 0;
                            
                            //create model object
                            $weather = new Weather;
                            
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
                                $weather->create($request->all());                
                                $msgType = 1;
                                $globalErrorMsg = "Successfully Saved.";                                             
                            }
                            
                            return response()->json([
                                'msgType' => $msgType,
                                'message' => $globalErrorMsg,
                                'category' => $weather
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
                            * @param  int  $id
                            * @return \Illuminate\Http\Response
                            */
                            public function show(Weather $weather)
                            {
                                $query = DB::table('weathers')          
                                ->select('weathers.*')
                                ->where('weathers.id', $weather->id) 
                                ->get();
                                //return response()->json($query);
                                
                                $weather_array = json_decode($query);
                                $weather_jsonarray = array();        
                                foreach($weather_array as $weatherkey => $weatherdata){
                                    $weather_jsonarray[$weatherkey]['id'] = $weatherdata->id;
                                    $weather_jsonarray[$weatherkey]['date'] = $weatherdata->date;
                                    $weather_jsonarray[$weatherkey]['location'] = json_decode($weatherdata->location);  
                                    $weather_jsonarray[$weatherkey]['temperature'] = json_decode($weatherdata->temperature);
                                }
                                
                                return response()->json($weather_jsonarray);                    
                            }
                            
                            /**
                            * Update the specified resource in storage.
                            *
                            * @param  \Illuminate\Http\Request  $request
                            * @param  int  $id
                            * @return \Illuminate\Http\Response
                            */
                            public function update(Request $request, Weather $weather)
                            {
                                try {                
                                    //CUSTOME VALIDATION
                                    $validator = Validator::make($request->all(),$this->validationRules(),$this->validationMessages());
                                    
                                    $errorsMsgObject = $validator->errors();
                                    $allErrorMsgArray = array();
                                    $globalErrorMsg = "";
                                    $msgType = 0;
                                    
                                    //create model object
                                    //$weather = new Weather;
                                    
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
                                        $weather->update($request->all());
                                        $msgType = 1;
                                        $globalErrorMsg = "Successfully Updated.";                                             
                                    }
                                    
                                    return response()->json([
                                        'msgType' => $msgType,
                                        'message' => $globalErrorMsg,
                                        'category' => $weather
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
                                    * @param  \App\Models\Weather $weather
                                    * @return \Illuminate\Http\Response
                                    */
                                    public function destroy(Weather $weather)
                                    {
                                        try {
                                            $weather->delete();
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
                                            
                                            
                                            
                                            public function eraseAll()
                                            {
                                                try {                                 
                                                    $query = DB::table('weathers')->delete();
                                                    return response()->json([
                                                        'msgType' => 1,
                                                        'message' => 'Successfully Erased all weather date.'
                                                        ]);                                 
                                                        
                                                    }catch (\Throwable $th) {
                                                        return response()->json([
                                                            'msgType' => 0,
                                                            'message' => $th->getMessage()               
                                                            ]);
                                                        }
                                                        
                                                    }
                                                    
                                                    public function eraseByDateRange($start,$end,$lat,$lon)
                                                    {
                                                        try {
                                                            
                                                            $query = DB::table('weathers')
                                                            ->whereBetween('date', [$this->stringToDateFormat($start), $this->stringToDateFormat($end)])
                                                            ->orWhere(function($query) {
                                                                $query->where('weathers.location', 'LIKE', '%"lat":"'.$lat.'"%')
                                                                ->orWhere('weathers.location', 'LIKE', '%"lon":"'.$lon.'"%'); 
                                                            })                                   
                                                            ->delete();
                                                            return response()->json([
                                                                'msgType' => 1,
                                                                'message' => 'Successfully Erased all weather date.'
                                                                ]);                                   
                                                                
                                                            }catch (\Throwable $th) {
                                                                return response()->json([
                                                                    'msgType' => 0,
                                                                    'message' => $th->getMessage()               
                                                                    ]);
                                                                }
                                                            }
                                                        }
                                                        