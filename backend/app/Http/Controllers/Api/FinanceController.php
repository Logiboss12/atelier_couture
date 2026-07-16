<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CashMovement;
use App\Models\Invoice;
use App\Models\Order;
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

        $currentWeek = $movements->filter(
            fn ($m) => Carbon::parse($m->date)->isSameWeek(now())
        );

        $entreesSemaine = $currentWeek->where('type', 'in')->sum('montant');
        $sortiesSemaine = $currentWeek->where('type', 'out')->sum('montant');

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

        $revenueGroupedByMonth = $movements->where('type', 'in')
            ->groupBy(fn ($m) => Carbon::parse($m->date)->format('Y-m'));

        $revenueByMonth = collect(range(5, 0))->map(function ($monthsAgo) use ($revenueGroupedByMonth) {
            $mois = now()->subMonths($monthsAgo)->format('Y-m');

            return [
                'mois' => $mois,
                'ca' => $revenueGroupedByMonth->get($mois, collect())->sum('montant'),
            ];
        });

        $revenueGroupedByWeek = $movements->where('type', 'in')
            ->groupBy(fn ($m) => Carbon::parse($m->date)->startOfWeek()->format('Y-m-d'));

        $revenueByWeek = collect(range(7, 0))->map(function ($weeksAgo) use ($revenueGroupedByWeek) {
            $semaine = now()->subWeeks($weeksAgo)->startOfWeek()->format('Y-m-d');

            return [
                'semaine' => $semaine,
                'ca' => $revenueGroupedByWeek->get($semaine, collect())->sum('montant'),
            ];
        });

        $orderProfitability = Order::with(['quotes' => fn ($q) => $q->latest('id'), 'invoices'])
            ->get()
            ->map(function (Order $order) {
                $quote = $order->quotes->first();

                if (! $quote || ! $quote->montant) {
                    return null;
                }

                $matieres = $quote->montant_matieres ?? 0;
                $marge = $quote->montant - $matieres;

                return [
                    'order_id' => $order->id,
                    'ref' => $order->ref,
                    'modele' => $order->modele,
                    'montant' => $quote->montant,
                    'montant_matieres' => $matieres,
                    'marge' => $marge,
                    'marge_pct' => $quote->montant > 0 ? round($marge / $quote->montant * 100) : null,
                    'payee' => $order->invoices->isNotEmpty() && $order->invoices->every(fn ($i) => $i->statut === 'payee'),
                ];
            })
            ->filter()
            ->values();

        $margeMoyennePct = $orderProfitability->isNotEmpty()
            ? round($orderProfitability->avg('marge_pct'))
            : null;

        return response()->json([
            'solde' => $solde,
            'entrees_mois' => $entrees,
            'sorties_mois' => $sorties,
            'benefice_net' => $entrees - $sorties,
            'entrees_semaine' => $entreesSemaine,
            'sorties_semaine' => $sortiesSemaine,
            'benefice_net_semaine' => $entreesSemaine - $sortiesSemaine,
            'impayes' => $impayes,
            'impayes_count' => $impayesCount,
            'payment_methods' => $paymentMethods,
            'expense_categories' => $expenseCategories,
            'revenue_by_month' => $revenueByMonth,
            'revenue_by_week' => $revenueByWeek,
            'order_profitability' => $orderProfitability,
            'marge_moyenne_pct' => $margeMoyennePct,
        ]);
    }
}
