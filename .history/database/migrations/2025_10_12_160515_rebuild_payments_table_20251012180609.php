<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'escrow_transaction_id')) {
                $table->foreignId('escrow_transaction_id')->nullable()->constrained('escrow_transactions')->cascadeOnDelete();
            }

            if (!Schema::hasColumn('payments', 'provider')) {
                $table->string('provider')->default('manual');
            }

            if (!Schema::hasColumn('payments', 'status')) {
                $table->string('status')->default('initiated'); // initiated, confirmed, failed, refunded
            }

            if (!Schema::hasColumn('payments', 'amount')) {
                $table->decimal('amount', 12, 2)->nullable();
            }

            if (!Schema::hasColumn('payments', 'paid_at')) {
                $table->timestamp('paid_at')->nullable();
            }

            if (!Schema::hasColumn('payments', 'reference')) {
                $table->string('reference')->nullable();
            }

            if (!Schema::hasColumn('payments', 'meta')) {
                $table->json('meta')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['escrow_transaction_id', 'provider', 'status', 'amount', 'paid_at', 'reference', 'meta']);
        });
    }
};

