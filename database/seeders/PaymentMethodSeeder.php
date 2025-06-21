<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $paymentMethods = [
            ['method_name' => 'Visa', 'method_type' => 'credit_card'],
            ['method_name' => 'Mastercard', 'method_type' => 'credit_card'],
            ['method_name' => 'JCB', 'method_type' => 'credit_card'],
            ['method_name' => 'AMEX', 'method_type' => 'credit_card'],
            ['method_name' => 'Visa Debit', 'method_type' => 'debit_card'],
            ['method_name' => 'Mastercard Debit', 'method_type' => 'debit_card'],
            ['method_name' => 'JCB Debit', 'method_type' => 'debit_card'],
            ['method_name' => 'AMEX Debit', 'method_type' => 'debit_card'],
            ['method_name' => 'Maya', 'method_type' => 'digital_wallet'],
            ['method_name' => 'GCash', 'method_type' => 'digital_wallet'],
            ['method_name' => 'WeChat Pay', 'method_type' => 'digital_wallet'],
            ['method_name' => 'ShopeePay', 'method_type' => 'digital_wallet'],
            ['method_name' => 'QR Ph', 'method_type' => 'digital_wallet'],
        ];

        foreach ($paymentMethods as $method) {
            PaymentMethod::create($method);
        }
    }
}
