<?php

namespace App\Http\Controllers;

use App\Models\Box;
use App\Models\RetentionRequest;
use DB;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class RetentionRequestController extends Controller
{
    public function index(Request $request)
    {
        return view('app');
    }

    public function store(Request $request)
    {
        // FIXME: does this return the correct response upon failure?
        $request->validate([
            'retention_request.manager_name' => 'required|string',
            'retention_request.requestor_name' => 'required|string',
            'retention_request.requestor_email' => 'required|email',
            // FIXME: should this have two seperate error messages?
            'retention_request.department_id' => 'required|exists:departments,id',
            'boxes' => 'required|array|min:1',
            'boxes.*.description' => 'required|string',
            'boxes.*.destroy_date' => 'nullable|date'
        ]);

        try {
            DB::beginTransaction();

            $retentionRequest = RetentionRequest::create($request->input('retention_request'));

            // FIXME: should the exceptions be more specific subtypes?
            if (!$retentionRequest)
                throw new Exeception('Failed to save a Retention Request');

            $retentionRequestId = $retentionRequest['id'];
            $boxesData = $request->input('boxes');

            foreach ($boxesData as $boxData) {
                $boxData['retention_request_id'] = $retentionRequestId;
                $box = Box::create($boxData);

                // FIXME: should the exceptions be more specific subtypes?
                if (!$box)
                    throw new Exception('Failed to save a Box');
            }

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();

            // FIXME: is this the correct way to respond?
            return response([
                'message' => $exception->getMessage(),
                'status' => 'failed'
            ], 400);
        }

        // FIXME: is this the correct way to respond?
        return response([
            'status' => 'success'
        ], 200);
    }
}