<?php

declare(strict_types=1);

use App\Enums\NotificationMethod;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expirations', function (Blueprint $table) {
            $table->ulid('id');
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignId('product_id')->constrained('products');
            $table->date('expires_at');
            $table->unsignedSmallInteger('quantity');
            $table->text('notes')->nullable();
            $table->enum('notification_method', NotificationMethod::cases())->default(NotificationMethod::Both);
            $table->unsignedSmallInteger('notification_days_before')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expirations');
    }
};
