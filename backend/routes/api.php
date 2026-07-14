<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CashMovementController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\FabricStockController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\MeController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductCollectionController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\StockMovementController;
use App\Http\Controllers\Api\TeamMemberController;
use App\Http\Controllers\Api\TextileController;
use Illuminate\Support\Facades\Route;

Route::post('auth/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

Route::middleware('auth.token')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Client-scoped "espace client" endpoints: act only on the authenticated user's own data.
    Route::get('me', [MeController::class, 'show']);
    Route::post('me/orders', [MeController::class, 'storeOrder']);
    Route::post('me/checkout', [MeController::class, 'checkout']);
    Route::get('me/invoices/{invoice}', [MeController::class, 'showInvoice']);
    Route::post('me/quotes/{quote}/convert', [MeController::class, 'convertQuote']);
});

// Public storefront reads: catalog data anyone may browse.
Route::get('textiles', [TextileController::class, 'index']);
Route::get('textiles/{textile}', [TextileController::class, 'show']);
Route::get('collections', [ProductCollectionController::class, 'index']);
Route::get('collections/{collection}', [ProductCollectionController::class, 'show']);
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product}', [ProductController::class, 'show']);

// Everything else is the back-office: admin-only.
Route::middleware(['auth.token', 'admin'])->group(function () {
    Route::get('finances/summary', [FinanceController::class, 'summary']);

    Route::apiResource('textiles', TextileController::class)->except(['index', 'show']);
    Route::apiResource('collections', ProductCollectionController::class)->except(['index', 'show']);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    Route::apiResource('team-members', TeamMemberController::class);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('quotes', QuoteController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('fabric-stocks', FabricStockController::class);
    Route::apiResource('stock-movements', StockMovementController::class);
    Route::apiResource('promotions', PromotionController::class);
    Route::apiResource('events', EventController::class);
    Route::apiResource('cash-movements', CashMovementController::class);
    Route::apiResource('deliveries', DeliveryController::class);
});
