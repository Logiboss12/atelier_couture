<?php

use App\Http\Controllers\Api\CashMovementController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\FabricStockController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductCollectionController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\StockMovementController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\TextileController;
use Illuminate\Support\Facades\Route;

Route::get('finances/summary', [FinanceController::class, 'summary']);

Route::apiResource('textiles', TextileController::class);
Route::apiResource('team-members', TeamMemberController::class);
Route::apiResource('clients', ClientController::class);
Route::apiResource('collections', ProductCollectionController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('quotes', QuoteController::class);
Route::apiResource('invoices', InvoiceController::class);
Route::apiResource('fabric-stocks', FabricStockController::class);
Route::apiResource('stock-movements', StockMovementController::class);
Route::apiResource('promotions', PromotionController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('cash-movements', CashMovementController::class);
Route::apiResource('deliveries', DeliveryController::class);
