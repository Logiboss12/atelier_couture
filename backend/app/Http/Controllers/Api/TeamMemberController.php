<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index()
    {
        return TeamMember::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'nom' => 'required|string',
            'role' => 'required|string',
            'role_color' => 'nullable|string',
            'permissions' => 'nullable|array',
            'charge' => 'nullable|integer|min:0|max:100',
            'assignees' => 'nullable|integer|min:0',
        ]);

        return TeamMember::create($data);
    }

    public function show(TeamMember $teamMember)
    {
        return $teamMember;
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'nom' => 'sometimes|required|string',
            'role' => 'sometimes|required|string',
            'role_color' => 'nullable|string',
            'permissions' => 'nullable|array',
            'charge' => 'nullable|integer|min:0|max:100',
            'assignees' => 'nullable|integer|min:0',
        ]);

        $teamMember->update($data);

        return $teamMember;
    }

    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();

        return response()->noContent();
    }
}
