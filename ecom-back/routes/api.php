// routes/api.php

<?php

Route::get('/email/verify/{token}', [AuthController::class, 'verify'])
    ->name('verification.verify');