<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EscrowTransaction;
use Illuminate\Http\Request;

class EscrowTransactionController extends Controller
{
    public function index(Request $r)
    {
        $q = EscrowTransaction::query()->with(['buyer','seller','payments']);

        // jednostavno filtriranje
        if ($r->filled('status'))    $q->where('status', $r->status);
        if ($r->filled('buyer_id'))  $q->where('buyer_id', $r->buyer_id);
        if ($r->filled('seller_id')) $q->where('seller_id', $r->seller_id);

        // paginacija (default 10)
        return response()->json($q->paginate(10));
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'buyer_id'   => 'required|exists:users,id',
            'seller_id'  => 'required|exists:users,id',
            'amount'     => 'required|numeric|min:0.01',
            'currency'   => 'required|string|size:3',
            'description'=> 'nullable|string',
            'expires_at' => 'nullable|date',
        ]);

        $tx = EscrowTransaction::create($data + ['status' => 'pending']);

        return response()->json($tx, 201);
    }

    public function show(EscrowTransaction $escrowTransaction)
    {
        return response()->json($escrowTransaction->load(['buyer','seller','payments']));
    }

    public function update(Request $r, EscrowTransaction $escrowTransaction)
    {
        $escrowTransaction->update($r->only([
            'amount','fee','currency','description','expires_at'
        ]));

        return response()->json($escrowTransaction);
    }

    public function destroy(EscrowTransaction $escrowTransaction)
    {
        $escrowTransaction->delete();
        return response()->json(null, 204);
    }

    // akcije 

    public function accept(EscrowTransaction $escrowTransaction)
    {
        if ($escrowTransaction->status !== 'pending') {
            return response()->json(['error' => 'Only pending can be accepted'], 422);
        }
        $escrowTransaction->update(['status' => 'accepted']);
        return response()->json($escrowTransaction);
    }

    public function release(EscrowTransaction $escrowTransaction)
    {
        if (!in_array($escrowTransaction->status, ['accepted'])) {
            return response()->json(['error' => 'Only accepted can be released'], 422);
        }
        $escrowTransaction->update([
            'status' => 'released',
            'released_at' => now()
        ]);
        return response()->json($escrowTransaction);
    }

    public function cancel(EscrowTransaction $escrowTransaction)
    {
        if (in_array($escrowTransaction->status, ['released','cancelled'])) {
            return response()->json(['error' => 'Already final'], 422);
        }
        $escrowTransaction->update(['status' => 'cancelled']);
        return response()->json($escrowTransaction);
    }
}
