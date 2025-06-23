<?php

return [
    'public_key' => env('MAYA_CHECKOUT_PUBLIC_KEY'), // This is correct
    'secret_key' => env('MAYA_CHECKOUT_SECRET_KEY'), // This is correct
    'checkout_url' => 'https://pg-sandbox.paymaya.com/checkout/v1/checkouts',
    'payments_url' => 'https://pg-sandbox.paymaya.com/payments/v1/payments',
];