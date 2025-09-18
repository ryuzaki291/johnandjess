<?php

namespace App\Http\Controllers;

use App\Models\MainMaintenance;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class MainMaintenanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            Log::info('Main maintenance index request started');
            
            $mainMaintenance = MainMaintenance::with(['vehicle', 'createdBy'])->get();
            
            Log::info('Main maintenance records retrieved', ['count' => $mainMaintenance->count()]);
            
            return response()->json([
                'success' => true,
                'data' => $mainMaintenance
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching main maintenance records: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching main maintenance records',
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
            Log::info('Main maintenance store request started');
            Log::info('Request data: ' . json_encode($request->all()));
            
            $validator = Validator::make($request->all(), [
                'assignee_name' => 'required|string|max:255',
                'region_assign' => 'required|string|max:255',
                'supplier_name' => 'required|string|max:255',
                'vehicle_details' => 'required|string',
                'plate_number' => 'required|string|max:50',
                'odometer_record' => 'required|string|max:255',
                'remarks' => 'nullable|string',
                'date_of_pms' => 'required|string',
                'performed' => 'required|string',
                'amount' => 'required|numeric',
                'qty' => 'required|integer',
                'documents.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed: ' . json_encode($validator->errors()));
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            // Get authenticated user or use default creator
            $authUser = Auth::user();
            Log::info('Auth user: ' . ($authUser ? $authUser->id : 'null'));
            Log::info('Auth check: ' . (Auth::check() ? 'true' : 'false'));

            $data = $request->all();
            $data['creator'] = $authUser ? $authUser->id : 1; // Fallback to user 1 for testing

            // Handle file uploads
            $documents = [];
            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $file) {
                    $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('maintenance_documents', $filename, 'public');
                    
                    $documents[] = [
                        'original_name' => $file->getClientOriginalName(),
                        'filename' => $filename,
                        'path' => $path,
                        'size' => $file->getSize(),
                        'mime_type' => $file->getMimeType()
                    ];
                }
            }
            $data['documents'] = $documents;

            Log::info('Creating main maintenance record with data: ' . json_encode($data));

            $mainMaintenance = MainMaintenance::create($data);
            
            // Load relationships
            $mainMaintenance->load(['vehicle', 'createdBy']);
            
            Log::info('Main maintenance record created successfully: ' . json_encode($mainMaintenance));

            return response()->json([
                'success' => true,
                'message' => 'Main maintenance record created successfully',
                'data' => $mainMaintenance
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating main maintenance record: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error creating main maintenance record',
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
            $mainMaintenance = MainMaintenance::with(['vehicle', 'createdBy'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $mainMaintenance
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching main maintenance record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Main maintenance record not found',
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
            Log::info('Main maintenance update request started for ID: ' . $id);
            
            $mainMaintenance = MainMaintenance::findOrFail($id);
            
            $validator = Validator::make($request->all(), [
                'assignee_name' => 'required|string|max:255',
                'region_assign' => 'required|string|max:255',
                'supplier_name' => 'required|string|max:255',
                'vehicle_details' => 'required|string|max:255',
                'plate_number' => 'required|string|exists:vehicles,plate_number',
                'odometer_record' => 'required|string|max:255',
                'date_of_pms' => 'required|string|max:255',
                'performed' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'qty' => 'required|numeric|min:0',
                'remarks' => 'nullable|string',
                'documents.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240',
                'documents_to_delete' => 'nullable|array',
                'documents_to_delete.*' => 'integer'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['documents', 'documents_to_delete']);
            
            // Handle existing documents and deletions
            $existingDocuments = $mainMaintenance->documents ?? [];
            $documentsToDelete = $request->input('documents_to_delete', []);
            
            // Remove documents marked for deletion
            if (!empty($documentsToDelete)) {
                foreach ($documentsToDelete as $indexToDelete) {
                    if (isset($existingDocuments[$indexToDelete])) {
                        // Delete physical file
                        Storage::disk('public')->delete($existingDocuments[$indexToDelete]['path']);
                        unset($existingDocuments[$indexToDelete]);
                    }
                }
                // Re-index array
                $existingDocuments = array_values($existingDocuments);
            }
            
            // Handle new file uploads
            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $file) {
                    $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $path = $file->storeAs('maintenance_documents', $filename, 'public');
                    
                    $existingDocuments[] = [
                        'original_name' => $file->getClientOriginalName(),
                        'filename' => $filename,
                        'path' => $path,
                        'size' => $file->getSize(),
                        'mime_type' => $file->getMimeType()
                    ];
                }
            }
            
            $data['documents'] = $existingDocuments;
            
            $mainMaintenance->update($data);
            $mainMaintenance->load(['vehicle', 'createdBy']);
            
            Log::info('Main maintenance record updated successfully');

            return response()->json([
                'success' => true,
                'message' => 'Main maintenance record updated successfully',
                'data' => $mainMaintenance
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating main maintenance record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error updating main maintenance record',
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
            Log::info('Main maintenance delete request started for ID: ' . $id);
            
            $mainMaintenance = MainMaintenance::findOrFail($id);
            $mainMaintenance->delete();
            
            Log::info('Main maintenance record deleted successfully');

            return response()->json([
                'success' => true,
                'message' => 'Main maintenance record deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting main maintenance record: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting main maintenance record',
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
            $vehicles = Vehicle::select('plate_number', 'vehicle_type', 'vehicle_brand', 'vehicle_status')->get();
            
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
     * Download a document
     */
    public function downloadDocument($id, $index)
    {
        try {
            $mainMaintenance = MainMaintenance::findOrFail($id);
            $documents = $mainMaintenance->documents ?? [];
            
            if (!isset($documents[$index])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found'
                ], 404);
            }
            
            $document = $documents[$index];
            $filePath = storage_path('app/public/' . $document['path']);
            
            if (!file_exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found on server'
                ], 404);
            }
            
            return response()->download($filePath, $document['original_name']);
            
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
     * Delete a specific document
     */
    public function deleteDocument($id, $index)
    {
        try {
            $mainMaintenance = MainMaintenance::findOrFail($id);
            $documents = $mainMaintenance->documents ?? [];
            
            if (!isset($documents[$index])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document not found'
                ], 404);
            }
            
            // Delete physical file
            Storage::disk('public')->delete($documents[$index]['path']);
            
            // Remove document from array and re-index
            unset($documents[$index]);
            $documents = array_values($documents);
            
            // Update the record
            $mainMaintenance->update(['documents' => $documents]);
            
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
