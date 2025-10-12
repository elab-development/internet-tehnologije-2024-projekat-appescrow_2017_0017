<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EscrowTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id','seller_id','amount','fee','currency','status',
        'description','expires_at','released_at'
    ];

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
