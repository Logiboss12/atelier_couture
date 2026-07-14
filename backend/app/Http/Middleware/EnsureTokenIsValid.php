<?php

namespace App\Http\Middleware;

use App\Models\AuthToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $authToken = AuthToken::with('user')
            ->where('token', hash('sha256', $token))
            ->first();

        if (! $authToken || $authToken->isExpired()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $authToken->forceFill(['last_used_at' => now()])->save();

        Auth::setUser($authToken->user);

        return $next($request);
    }
}
