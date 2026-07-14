<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CashMovement;
use App\Models\Invoice;
use Illuminate\Support\Carbon;

class FinanceController extends Controller
{
    public function summary()
    {
        $movements = CashMovement::all();

        $unpaidInvoices = Invoice::whereIn('statut', ['impayee', 'en_attente'])->get();
        $impayes = $unpaidInvoices->sum('total');
        $impayesCount = $unpaidInvoices->count();

        $solde = $movements->sum(fn ($m) => $m->type === 'in' ? $m->montant : -$m->montant);

        $currentMonth = $movements->filter(
            fn ($m) => Carbon::parse($m->date)->isSameMonth(now())
        );

        $entrees = $currentMonth->where('type', 'in')->sum('montant');
        $sorties = $currentMonth->where('type', 'out')->sum('montant');

        $paymentMethods = $movements->where('type', 'in')->groupBy('moyen_paiement')
            ->map(fn ($group, $moyen) => [
                'moyen_paiement' => $moyen,
                'montant' => $group->sum('montant'),
            ])->values();

        $totalIn = $paymentMethods->sum('montant');
        $paymentMethods = $paymentMethods->map(fn ($m) => [
            ...$m,
            'pct' => $totalIn > 0 ? round($m['montant'] / $totalIn * 100) : 0,
        ]);

        $expenseCategories = $movements->where('type', 'out')->whereNotNull('categorie')
            ->groupBy('categorie')
            ->map(fn ($group, $categorie) => [
                'categorie' => $categorie,
                'montant' => $group->sum('montant'),
            ])->values();

        $totalOut = $expenseCategories->sum('montant');
        $expenseCategories = $expenseCategories->map(fn ($c) => [
            ...$c,
            'pct' => $totalOut > 0 ? round($c['montant'] / $totalOut * 100) : 0,
        ]);

        $revenueByMonth = $movements->where('type', 'in')
            ->groupBy(fn ($m) => Carbon::parse($m->date)->format('Y-m'))
            ->map(fn ($group, $mois) => ['mois' => $mois, 'ca' => $group->sum('montant')])
            ->values();

        return response()->json([
            'solde' => $solde,
            'entrees_mois' => $entrees,
            'sorties_mois' => $sorties,
            'benefice_net' => $entrees - $sorties,
            'impayes' => $impayes,
            'impayes_count' => $impayesCount,
            'payment_methods' => $paymentMethods,
            'expense_categories' => $expenseCategories,
            'revenue_by_month' => $revenueByMonth,
        ]);
    }
}
