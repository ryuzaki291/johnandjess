<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            Log::info('Contracts index request started');
            
            $contracts = Contract::with(['vehicle', 'createdBy'])->get();
            
            Log::info('Contract records retrieved', ['count' => $contracts->count()]);
            
            return response()->json([
                'success' => true,
                'data' => $contracts
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching contract records: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching contract records',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            Log::info('Contract store request started');
            Log::info('Request data: ' . json_encode($request->all()));
            
            $validator = Validator::make($request->all(), [
                'particular' => 'required|string|max:255',
                'vehicle_type' => 'required|string|max:255',
                'plate_number' => 'required|string|exists:vehicles,plate_number',
                'owners_name' => 'required|string|max:255',
                'company_assigned' => 'required|string|in:DITO TELECOMMUNITY CORPORATION,CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION,FUTURENET AND TECHNOLOGY CORPORATION,BESTWORLD ENGINEERING SDN BHD',
                'location_area' => 'required|string|max:255',
                'drivers_name' => 'required|string|max:255',
                'amount_range' => 'nullable|string|max:255',
                '12m_vat' => 'nullable|string|max:255',
                'contract_amount' => 'required|numeric|min:0',
                'less_ewt' => 'nullable|numeric|min:0',
                'final_amount' => 'required|numeric|min:0',
                'remarks' => 'nullable|string',
                'suppliers_amount' => 'nullable|numeric|min:0',
                'drivers_salary' => 'nullable|numeric|min:0',
                'revenue' => 'nullable|numeric|min:0',
                'documents' => 'nullable|array',
                'documents.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png,gif|max:10240',
                'start_date' => 'nullable|date',
                'end_remarks' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . json_encode($validator->errors()));
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get authenticated user or use default creator
            $authUser = Auth::user();
            Log::info('Auth user: ' . ($authUser ? $authUser->id : 'null'));

            $data = $request->all();
            $data['creator'] = $authUser ? $authUser->id : 1; // Fallback to user 1 for testing

            // Handle file uploads
            $documents = [];
            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $file) {
                    $originalName = $file->getClientOriginalName();
                    $fileName = time() . '_' . uniqid() . '_' . $originalName;
                    $filePath = $file->storeAs('contracts/documents', $fileName, 'public');
                    
                    $documents[] = [
                        'name' => $originalName,
                        'path' => $filePath,
                        'size' => $file->getSize(),
                        'type' => $file->getMimeType(),
                        'uploaded_at' => now()->toISOString()
                    ];
                }
            }
            $data['documents'] = $documents;

            Log::info('Creating contract record with data: ' . json_encode($data));

            $contract = Contract::create($data);
            
            // Load relationships
            $contract->load(['vehicle', 'createdBy']);
            
            Log::info('Contract record created successfully: ' . json_encode($contract));

            return response()->json([
                'success' => true,
                'message' => 'Contract record created successfully',
                'data' => $contract
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating contract record: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error creating contract record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $contract = Contract::with(['vehicle', 'createdBy'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $contract
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching contract record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Contract record not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Contract update request started for ID: ' . $id);
            
            $contract = Contract::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'particular' => 'required|string|max:255',
                'vehicle_type' => 'required|string|max:255',
                'plate_number' => 'required|string|exists:vehicles,plate_number',
                'owners_name' => 'required|string|max:255',
                'company_assigned' => 'required|string|in:DITO TELECOMMUNITY CORPORATION,CHINA COMMUNICATION SERVICES PHILIPPINES CORPORATION,FUTURENET AND TECHNOLOGY CORPORATION,BESTWORLD ENGINEERING SDN BHD',
                'location_area' => 'required|string|max:255',
                'drivers_name' => 'required|string|max:255',
                'amount_range' => 'nullable|string|max:255',
                '12m_vat' => 'nullable|string|max:255',
                'contract_amount' => 'required|numeric|min:0',
                'less_ewt' => 'nullable|numeric|min:0',
                'final_amount' => 'required|numeric|min:0',
                'remarks' => 'nullable|string',
                'suppliers_amount' => 'nullable|numeric|min:0',
                'drivers_salary' => 'nullable|numeric|min:0',
                'revenue' => 'nullable|numeric|min:0',
                'documents' => 'nullable|array',
                'documents.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png,gif|max:10240',
                'start_date' => 'nullable|date',
                'end_remarks' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();
            
            // Handle file uploads
            if ($request->hasFile('documents')) {
                $existingDocuments = $contract->documents ?? [];
                $newDocuments = [];
                
                foreach ($request->file('documents') as $file) {
                    $originalName = $file->getClientOriginalName();
                    $fileName = time() . '_' . uniqid() . '_' . $originalName;
                    $filePath = $file->storeAs('contracts/documents', $fileName, 'public');
                    
                    $newDocuments[] = [
                        'name' => $originalName,
                        'path' => $filePath,
                        'size' => $file->getSize(),
                        'type' => $file->getMimeType(),
                        'uploaded_at' => now()->toISOString()
                    ];
                }
                
                $data['documents'] = array_merge($existingDocuments, $newDocuments);
            }

            $contract->update($data);
            $contract->load(['vehicle', 'createdBy']);
            
            Log::info('Contract record updated successfully');

            return response()->json([
                'success' => true,
                'message' => 'Contract record updated successfully',
                'data' => $contract
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating contract record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating contract record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            Log::info('Contract delete request started for ID: ' . $id);
            
            $contract = Contract::findOrFail($id);
            $contract->delete();
            
            Log::info('Contract record deleted successfully');

            return response()->json([
                'success' => true,
                'message' => 'Contract record deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting contract record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting contract record',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vehicles for dropdown selection
     */
    public function getVehicles()
    {
        try {
            $vehicles = Vehicle::select('plate_number', 'vehicle_type', 'vehicle_brand', 'vehicle_owner')->get();
            
            return response()->json([
                'success' => true,
                'data' => $vehicles
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching vehicles: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching vehicles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download a document from a contract
     */
    public function downloadDocument($contractId, $documentIndex)
    {
        try {
            $contract = Contract::findOrFail($contractId);
            $documents = $contract->documents ?? [];
            
            if (!isset($documents[$documentIndex])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found'
                ], 404);
            }
            
            $document = $documents[$documentIndex];
            $filePath = storage_path('app/public/' . $document['path']);
            
            if (!file_exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found on server'
                ], 404);
            }
            
            return response()->download($filePath, $document['name']);
            
        } catch (\Exception $e) {
            Log::error('Error downloading document: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error downloading document',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a specific document from a contract
     */
    public function deleteDocument(Request $request, $contractId)
    {
        try {
            $contract = Contract::findOrFail($contractId);
            $documentIndex = $request->input('document_index');
            $documents = $contract->documents ?? [];
            
            if (!isset($documents[$documentIndex])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found'
                ], 404);
            }
            
            $document = $documents[$documentIndex];
            $filePath = storage_path('app/public/' . $document['path']);
            
            // Delete file from storage
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            
            // Remove document from array
            unset($documents[$documentIndex]);
            $documents = array_values($documents); // Re-index array
            
            $contract->update(['documents' => $documents]);
            
            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error deleting document: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting document',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
