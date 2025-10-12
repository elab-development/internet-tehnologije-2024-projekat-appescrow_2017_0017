<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'escrow_transaction_id','provider','status','amount','paid_at','reference','meta'
    ];

    protected $casts = [
        'meta' => 'array',
        'paid_at' => 'datetime',
    ];

    public function escrow()
    {
        return $this->belongsTo(EscrowTransaction::class, 'escrow_transaction_id');
    }
}
