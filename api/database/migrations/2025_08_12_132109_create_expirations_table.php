<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expirations', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->constrained('users');
            $table->foreignUlid('product_id')->constrained('products');
            $table->date('expires_at');
            $table->unsignedSmallInteger('quantity')->nullable();
            $table->text('notes')->nullable();
            $table->string('notification_method');
            $table->unsignedSmallInteger('notification_days_before')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expirations');
    }
};
