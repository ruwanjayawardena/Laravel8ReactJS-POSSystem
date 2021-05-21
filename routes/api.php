<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MaincategoryController;
use App\Http\Controllers\Sub1categoryController;
use App\Http\Controllers\Sub2categoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\GrnController;
use App\Http\Controllers\RemoveStockController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OutletController;
use App\Http\Controllers\BillController;
// use App\Http\Controllers\WeatherController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//Combo boxes
Route::get('/cmb/maincategory',[MaincategoryController::class, 'cmbMainCategory']);
Route::get('/cmb/sub1categories/{id}',[Sub1categoryController::class, 'cmbSubCategory']);
Route::get('/cmb/sub2categories/{id}',[Sub2categoryController::class, 'cmbSub2Category']);
Route::get('/cmb/products/{id}',[ProductController::class, 'cmbProducts']);
Route::get('/cmb/supplier',[SupplierController::class, 'cmbSupplier']);
Route::get('/cmb/customer',[CustomerController::class, 'cmbCustomer']);
Route::get('/cmb/customerdesc',[CustomerController::class, 'cmbCustomerIDDesc']);

// Main Category
Route::get('/maincategories',[MaincategoryController::class, 'index']);
Route::post('/maincategories/filterdata',[MaincategoryController::class, 'getDataTableFilterData']);
Route::post('/maincategories',[MaincategoryController::class, 'store']);
Route::get('/maincategories/{maincategory}',[MaincategoryController::class, 'show']);
Route::put('/maincategories/{maincategory}',[MaincategoryController::class, 'update']);
Route::delete('/maincategories/{maincategory}',[MaincategoryController::class, 'destroy']);

// Sub1 Category
Route::get('/sub1categories',[Sub1categoryController::class, 'index']);
Route::post('/sub1categories/filterdata',[Sub1categoryController::class, 'getDataTableFilterData']);
Route::post('/sub1categories',[Sub1categoryController::class, 'store']);
Route::get('/sub1categories/{sub1category}',[Sub1categoryController::class, 'show']);
Route::put('/sub1categories/{sub1category}',[Sub1categoryController::class, 'update']);
Route::delete('/sub1categories/{sub1category}',[Sub1categoryController::class, 'destroy']);

// Sub2 Category
Route::get('/sub2categories',[Sub2categoryController::class, 'index']);
Route::get('/sub2categories/autogenerateproducts',[Sub2categoryController::class, 'autoproductquery']);
Route::post('/sub2categories/filterdata',[Sub2categoryController::class, 'getDataTableFilterData']);
Route::post('/sub2categories',[Sub2categoryController::class, 'store']);
Route::get('/sub2categories/{sub2category}',[Sub2categoryController::class, 'show']);
Route::put('/sub2categories/{sub2category}',[Sub2categoryController::class, 'update']);
Route::delete('/sub2categories/{sub2category}',[Sub2categoryController::class, 'destroy']);

// Product
Route::get('/products/product_code/{sub2category}',[ProductController::class, 'generateProductCode']);
Route::get('/products',[ProductController::class, 'index']);
Route::get('/products/getNextProductID',[ProductController::class, 'getNextAutoIncrementID']);
Route::post('/products/filterdata',[ProductController::class, 'getDataTableFilterData']);
Route::post('/products',[ProductController::class, 'store']);
Route::post('/products/uploadProductImage',[ProductController::class, 'uploadImage']);
Route::post('/products/updateProductImage',[ProductController::class, 'updateProductImage']);
Route::get('/products/getImagePath',[ProductController::class, 'getImagePath']);
Route::get('/products/{product}',[ProductController::class, 'show']);
Route::put('/products/{product}',[ProductController::class, 'update']);
Route::post('/products/pricesupdate',[ProductController::class, 'updatePrices']);
Route::delete('/products/{product}',[ProductController::class, 'destroy']);

// Supplier
Route::get('/supplier',[SupplierController::class, 'index']);
Route::post('/supplier/filterdata',[SupplierController::class, 'getDataTableFilterData']);
Route::post('/supplier',[SupplierController::class, 'store']);
Route::get('/supplier/{supplier}',[SupplierController::class, 'show']);
Route::put('/supplier/{supplier}',[SupplierController::class, 'update']);
Route::delete('/supplier/{supplier}',[SupplierController::class, 'destroy']);

// Customer
Route::get('/customer',[CustomerController::class, 'index']);
Route::post('/customer/filterdata',[CustomerController::class, 'getDataTableFilterData']);
Route::post('/customer',[CustomerController::class, 'store']);
Route::get('/customer/{customer}',[CustomerController::class, 'show']);
Route::put('/customer/{customer}',[CustomerController::class, 'update']);
Route::delete('/customer/{customer}',[CustomerController::class, 'destroy']);

// Outlet
Route::get('/outlet',[OutletController::class, 'index']);
Route::post('/outlet/filterdata',[OutletController::class, 'getDataTableFilterData']);
Route::post('/outlet',[OutletController::class, 'store']);
Route::get('/outlet/{outlet}',[OutletController::class, 'show']);
Route::put('/outlet/{outlet}',[OutletController::class, 'update']);
Route::delete('/outlet/{outlet}',[OutletController::class, 'destroy']);

//Bill
Route::post('/bill',[BillController::class, 'store']);
Route::get('/bill/checkauth/{id}',[BillController::class, 'changeAuth']);
Route::get('/bill/cancel/{id}',[BillController::class, 'billCancel']);
Route::get('/bill/{id}',[BillController::class, 'getBillInfoByBill']);
Route::get('/bill/items/{id}',[BillController::class, 'getBillItemsByBill']);
Route::get('/bill/customer/{id}',[BillController::class, 'getBillCustomerByBill']);

// Grn
Route::get('/grn',[GrnController::class, 'index']);
Route::post('/grn/filterdata',[GrnController::class, 'getDataTableFilterData']);
Route::post('/grn',[GrnController::class, 'store']);
Route::get('/grn/{grn}',[GrnController::class, 'show']);
Route::get('/grn/stock/{id}',[GrnController::class, 'getGrnStockProducts']);
Route::post('/grn/return/full',[GrnController::class, 'returnFullGrn']);
// Route::post('/grn/return/fullStock',[GrnController::class, 'returnFullSingleStock']);
Route::post('/grn/return/fullStock',[GrnController::class, 'returnFullSingleStock']);
Route::post('/grn/return/partialStock',[GrnController::class, 'returnPartialSingleStock']);
// Route::get('/grn/return/getStockStatus/{product}/{grn}',[GrnController::class, 'getStockStatusByReturnStockQty']);
// Route::get('/grn/return/test/{grn}',[GrnController::class, 'stocksFullReturnedChanageStatus']);
Route::put('/grn/{grn}',[GrnController::class, 'update']);
Route::delete('/grn/{grn}',[GrnController::class, 'destroy']);

//report
Route::post('/report/returngrn',[GrnController::class, 'getDataTableReturnGrnFilterData']);
Route::get('/report/returnstock/{id}',[GrnController::class, 'getGrnReturnStockProducts']);
Route::post('/report/product',[ProductController::class, 'index']);
Route::post('/report/bill',[BillController::class, 'index']);

//Remove Stock
Route::get('/removestock',[RemoveStockController::class, 'index']);
Route::post('/removestock/filterdata',[RemoveStockController::class, 'getDataTableFilterData']);
Route::post('/removestock',[RemoveStockController::class, 'store']);
Route::get('/removestock/{removestock}',[RemoveStockController::class, 'show']);


//weatherAPI
Route::delete('/earse',[WeatherController::class, 'eraseAll']);
Route::delete('/earse/{start}/{end}/{lat}/{lon}',[WeatherController::class, 'eraseByDateRange']);
Route::get('/weather',[WeatherController::class, 'index']);
Route::get('/weather/{lat}/{lon}',[WeatherController::class, 'filterByLatLon']);
Route::get('/weather/filterbydate/{startdate}/{enddate}',[WeatherController::class, 'filterByDate']);
Route::post('/weather',[WeatherController::class, 'store']);
Route::put('/weather/{weather}',[WeatherController::class, 'update']);
Route::post('/weather/filterdata',[WeatherController::class, 'getDataTableFilterData']);
Route::get('/weather/{weather}',[WeatherController::class, 'show']);
Route::delete('/weather/{weather}',[WeatherController::class, 'destroy']);
Route::get('/weather/temperature/{startDate}/{endDate}',[WeatherController::class, 'filterTemperatureByLatLon']);