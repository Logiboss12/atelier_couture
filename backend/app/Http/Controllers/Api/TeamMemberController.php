<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeamMemberController extends Controller
{
    public function index()
    {
        return TeamMember::with('user:id,email,role')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'role' => 'required|string',
            'role_color' => 'nullable|string',
            'permissions' => 'nullable|array',
            'charge' => 'nullable|integer|min:0|max:100',
            'assignees' => 'nullable|integer|min:0',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:8',
        ]);

        $data['user_id'] = $this->maybeCreateAccount($data);

        return TeamMember::create($data)->load('user:id,email,role');
    }

    public function show(TeamMember $teamMember)
    {
        return $teamMember->load('user:id,email,role');
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $data = $request->validate([
            'nom' => 'sometimes|required|string',
            'role' => 'sometimes|required|string',
            'role_color' => 'nullable|string',
            'permissions' => 'nullable|array',
            'charge' => 'nullable|integer|min:0|max:100',
            'assignees' => 'nullable|integer|min:0',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|string|min:8',
        ]);

        if (! $teamMember->user_id && ($newUserId = $this->maybeCreateAccount($data))) {
            $data['user_id'] = $newUserId;
        }

        $teamMember->update($data);

        return $teamMember->load('user:id,email,role');
    }

    private function maybeCreateAccount(array $data): ?int
    {
        if (empty($data['email']) || empty($data['password'])) {
            return null;
        }

        return User::create([
            'name' => $data['nom'] ?? $data['email'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'employe',
        ])->id;
    }

    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();

        return response()->noContent();
    }
}
