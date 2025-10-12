<?php

namespace App\Http\Controllers;

use App\Models\ClientName;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ClientNameController extends Controller
{
    /**
     * Display a listing of the client names.
     */
    public function index(): JsonResponse
    {
        $clientNames = ClientName::orderBy('name')
            ->select(['id', 'name', 'description', 'is_active', 'is_default', 'created_at', 'updated_at'])
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $clientNames
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created client name in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:client_names,name',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ]);

        // If setting as default, ensure only one default exists
        if ($validated['is_default'] ?? false) {
            ClientName::where('is_default', true)->update(['is_default' => false]);
        }

        $clientName = ClientName::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Client name created successfully',
            'data' => $clientName
        ], 201);
    }

    /**
     * Display the specified client name.
     */
    public function show(ClientName $clientName): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $clientName->load('dailyTrips:id,client_name_id,trip_date,driver_name,plate_number')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClientName $clientName)
    {
        //
    }

    /**
     * Update the specified client name in storage.
     */
    public function update(Request $request, ClientName $clientName): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('client_names', 'name')->ignore($clientName->id)
            ],
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'is_default' => 'boolean',
        ]);

        // If setting as default, ensure only one default exists
        if ($validated['is_default'] ?? false) {
            ClientName::where('id', '!=', $clientName->id)
                ->where('is_default', true)
                ->update(['is_default' => false]);
        }

        $clientName->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Client name updated successfully',
            'data' => $clientName->fresh()
        ]);
    }

    /**
     * Remove the specified client name from storage.
     */
    public function destroy(ClientName $clientName): JsonResponse
    {
        // Check if client name is used in daily trips
        $usageCount = $clientName->dailyTrips()->count();
        
        if ($usageCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete client name '{$clientName->name}' as it is used in {$usageCount} daily trip(s)"
            ], 422);
        }

        $clientName->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client name deleted successfully'
        ]);
    }

    /**
     * Get all active client names for dropdown.
     */
    public function getActive(): JsonResponse
    {
        $clientNames = ClientName::active()
            ->orderBy('name')
            ->select(['id', 'name'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $clientNames
        ]);
    }

    /**
     * Set a client name as default.
     */
    public function setDefault(ClientName $clientName): JsonResponse
    {
        $clientName->setAsDefault();

        return response()->json([
            'success' => true,
            'message' => 'Default client name updated successfully'
        ]);
    }

    /**
     * Toggle active status of a client name.
     */
    public function toggleActive(ClientName $clientName): JsonResponse
    {
        $clientName->update(['is_active' => !$clientName->is_active]);

        $status = $clientName->is_active ? 'activated' : 'deactivated';

        return response()->json([
            'success' => true,
            'message' => "Client name {$status} successfully",
            'data' => $clientName->fresh()
        ]);
    }
}
