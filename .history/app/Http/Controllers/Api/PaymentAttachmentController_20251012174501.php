<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentAttachmentController extends Controller
{
    public function store(Request $r, Payment $payment)
    {
        $r->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120' // do 5MB
        ]);

        $path = $r->file('file')->store('attachments', 'public');

        $payment->update(['attachment_path' => $path]);

        return response()->json([
            'message' => 'Attachment uploaded',
            'payment_id' => $payment->id,
            'attachment_url' => asset('storage/'.$path)
        ], 201);
    }
}
