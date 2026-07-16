<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CashMovementController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DeliveryController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\FabricStockController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\MeasurementController;
use App\Http\Controllers\Api\MeController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderStatusController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductCollectionController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\SettingController;
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
    Route::post('me/measurements', [MeController::class, 'storeMeasurement']);
    Route::post('me/orders/{order}/photos', [MeController::class, 'uploadOrderPhoto']);
    Route::post('me/checkout', [MeController::class, 'checkout']);
    Route::get('me/invoices/{invoice}', [MeController::class, 'showInvoice']);
    Route::get('me/invoices/{invoice}/pdf', [MeController::class, 'downloadInvoicePdf']);
    Route::post('me/invoices/{invoice}/pay', [MeController::class, 'payInvoiceCheckout']);
    Route::post('me/quotes/{quote}/convert', [MeController::class, 'convertQuote']);
    Route::post('me/notifications/{notification}/read', [MeController::class, 'markNotificationRead']);
});

// Public storefront reads: catalog data anyone may browse.
Route::get('textiles', [TextileController::class, 'index']);
Route::get('textiles/{textile}', [TextileController::class, 'show']);
Route::get('collections', [ProductCollectionController::class, 'index']);
Route::get('collections/{collection}', [ProductCollectionController::class, 'show']);
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{product}', [ProductController::class, 'show']);
Route::get('order-statuses', [OrderStatusController::class, 'index']);

// Webhook CinetPay : appelé par CinetPay lui-même (jamais par le navigateur), pas d'auth token.
Route::post('webhooks/cinetpay', [PaymentController::class, 'cinetpayWebhook']);

// Back-office limité : accessible aux couturiers/employés comme aux admins
// (traiter les commandes, saisir les mesures, faire progresser les étapes, envoyer un devis, gérer les livraisons).
Route::middleware(['auth.token', 'staff'])->group(function () {
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('measurements', MeasurementController::class);
    Route::apiResource('orders', OrderController::class);
    Route::post('orders/{order}/photos', [OrderController::class, 'uploadPhoto']);
    Route::delete('orders/{order}/photos', [OrderController::class, 'removePhoto']);
    Route::apiResource('quotes', QuoteController::class);
    Route::apiResource('deliveries', DeliveryController::class);
});

// Back-office complet : réservé aux administrateurs (catalogue, stocks, finances, équipe, promotions).
Route::middleware(['auth.token', 'admin'])->group(function () {
    Route::get('finances/summary', [FinanceController::class, 'summary']);

    Route::apiResource('textiles', TextileController::class)->except(['index', 'show']);
    Route::post('textiles/{textile}/image', [TextileController::class, 'uploadImage']);
    Route::apiResource('collections', ProductCollectionController::class)->except(['index', 'show']);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    Route::post('products/{product}/image', [ProductController::class, 'uploadImage']);

    Route::post('order-statuses', [OrderStatusController::class, 'store']);
    Route::put('order-statuses/reorder', [OrderStatusController::class, 'reorder']);
    Route::put('order-statuses/{orderStatus}', [OrderStatusController::class, 'update']);
    Route::delete('order-statuses/{orderStatus}', [OrderStatusController::class, 'destroy']);

    Route::apiResource('team-members', TeamMemberController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'pdf']);
    Route::apiResource('fabric-stocks', FabricStockController::class);
    Route::apiResource('stock-movements', StockMovementController::class);
    Route::apiResource('promotions', PromotionController::class);
    Route::apiResource('events', EventController::class);
    Route::apiResource('cash-movements', CashMovementController::class);

    Route::get('settings', [SettingController::class, 'index']);
    Route::put('settings', [SettingController::class, 'update']);
});
