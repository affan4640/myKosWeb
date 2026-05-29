<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {

            // proof image nullable
            $table->string('proof_image')->nullable()->change();

            // tambah field baru
            $table->string('external_id')->nullable()->after('invoice_id');

            $table->string('payment_method')->nullable()->after('external_id');

            $table->string('payment_channel')->nullable()->after('payment_method');

            $table->integer('paid_amount')->nullable()->after('payment_channel');

            // ubah enum status
            $table->enum('status', [
                'pending',
                'paid',
                'failed',
                'expired',
                'rejected',
                'refunded'
            ])->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {

            $table->string('proof_image')->nullable(false)->change();

            $table->dropColumn([
                'external_id',
                'payment_method',
                'payment_channel',
                'paid_amount'
            ]);

            $table->enum('status', [
                'pending',
                'verified',
                'rejected'
            ])->default('pending')->change();
        });
    }
};