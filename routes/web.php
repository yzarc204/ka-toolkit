<?php

use Illuminate\Support\Facades\Route;

// Catch-all route to serve the Vue app
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');