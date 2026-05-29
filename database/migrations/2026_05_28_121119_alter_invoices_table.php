<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {

            $table->string('midtrans_order_id')
                ->nullable()
                ->change();

            $table->string('snap_token')
                ->nullable()
                ->change();

            // XENDIT
            $table->string('external_id')->nullable()->unique();

            $table->string('xendit_invoice_id')->nullable();

            $table->string('invoice_url')->nullable();

            $table->timestamp('expired_at')->nullable();

            $table->string('payment_method')->nullable();

        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
