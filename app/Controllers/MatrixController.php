<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use \App\Models\Matrix as Matrix;
use App\Includes\ValidationRules as ValidationRules;

class MatrixController {
    private $logger;
    private $db;
    private $validator;
    
    private $table;

    // Dependency injection via constructor
    public function __construct($depLogger, $depDB, $depValidator) {
        $this->logger = $depLogger;
        $this->db = $depDB;
        $this->validator = $depValidator;
    }
    
    // GET /matrixes
    // Lists all matrixes
    public function all(Request $request, Response $response) {
        $this->logger->addInfo('GET matrixes');
        $queries = $request->getQueryParams();
        $count = Matrix::count();
        $matrixes = null;
        if(array_key_exists('sort', $queries)) {
            $queries['sort'] = str_replace("'","\"", $queries['sort']);
            $queries['sort'] = json_decode($queries['sort'], true);
            $matrixes = Matrix::orderBy($queries['sort'][0], $queries['sort'][1]);
        }

        if(array_key_exists('filter', $queries)) {
            $queries['filter'] = str_replace("'","\"", $queries['filter']);
            $queries['filter'] = json_decode($queries['filter'], true);
            if(array_key_exists('ids', $queries['filter'])) {
                if($matrixes == null) $matrixes = Matrix::whereIn('id', $queries['filter']['ids']);
                else $matrixes = $matrixes->whereIn('id', $queries['filter']['ids']);
            } else if(array_key_exists(0, $queries['filter']) && array_key_exists(1, $queries['filter'])) {
                if($matrixes == null) $matrixes = Matrix::where($queries['filter'][0], '==', $queries['filter'][1]);
                else $matrixes = $matrixes->where($queries['filter'][0], '==', $queries['filter'][1]);
            }
        }

        if(array_key_exists('range', $queries)) {
            $queries['range'] = json_decode($queries['range'], true);
            $response = $response->withHeader('content-range', 'matrixes '.$queries['range'][0].'-'.$queries['range'][1].'/'.$count);
            if($matrixes == null) $matrixes = Matrix::skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
            else $matrixes = $matrixes->skip($queries['range'][0])->take($queries['range'][1] - $queries['range'][0]);
        }

        if(!array_key_exists('sort', $queries) && !array_key_exists('filter', $queries) && !array_key_exists('range', $queries)) {
            $matrixes = Matrix::all();
        } else {
            $matrixes = $matrixes->get();
        }


        return $response->withJson(['data' => $matrixes, 'count' => $count], 200);
    }
    
    // GET /matrixes/{id}
    // Retrieve matrix data by ID
    public function find(Request $request, Response $response, $args) {
        $this->logger->addInfo('GET /matrixes/'.$args['id']);
        $user = $request->getAttribute('user');
        $matrix = Matrix::find($args['id']);
        if ($matrix) {
            return $response->withJson([
                'success' => true,
                'data' => $matrix
            ], 200);
        } else {
            return $response->withJson([
                'success' => false,
                'errors' => ['matrix' => ['Matrix not found: '.$args['id']]]
            ], 400);
        }
    }
    
    // POST /matrixes
    // Create matrix
    public function create(Request $request, Response $response) {
        $this->logger->addInfo('POST /matrixes');
        $data = $request->getParsedBody();
        // The validate method returns the validator instance
        $validator = $this->validator->validate($request, ValidationRules::matrixesPost());
        if ($validator->isValid()) {
            // Input is valid, so let's do something...
            $matrix = Matrix::firstOrCreate([
                'name' => $data['name'],
                'difficulty' => $data['difficulty'],
                'matrixString' => $data['matrixString'],
                'red_points' => $data['red_points'],
                'green_points' => $data['green_points'],
                'institution_id' => $data['institution_id'],
                'user_id' => $data['user_id']
            ]);
            return $response->withJson([
                'success' => true,
                'data' => $matrix
            ], 200);
        } else {
            // Validation error
            return $response->withJson([
                'success' => false,
                'errors' => $validator->getErrors()
            ], 400);
        }
    }
    
    // PUT /matrixes/{id}
    // Updates matrix
    public function update(Request $request, Response $response, $args) {
        $this->logger->addInfo('PUT /matrixes/'.$args['id']);
        $data = $request->getParsedBody();
        $errors = [];
        // validate inputs
        $validator = $this->validator->validate($request, ValidationRules::matrixesPost());
        if (!$validator->isValid()) {
            $errors = $validator->getErrors();
        }
        // check category ID exists
        $matrix = Matrix::find($args['id']);
        if (!$errors && !$matrix) {
            $errors = ['matrix' => ['Matrix not found: '.$args['id']]];
        }
        // No errors? Update DB
        if (!$errors) {
            if (isset($data['name']) && isset($data['difficulty']) && isset($data['matrixString'])) {
                $matrix->name = $data['name'];
                $matrix->difficulty = $data['difficulty'];
                $matrix->matrixString = $data['matrixString'];
            }
            $matrix->save();
            return $response->withJson(['success' => true], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }
    
    // DELETE /matrixes/{id}
    // Delete a matrix
    public function delete(Request $request, Response $response, $args) {
        $data = $request->getParsedBody();
        $errors = [];
        // check category ID exists
        $matrix = Matrix::withTrashed()->find($args['id']);
        if (!$errors && !$matrix) {
            $errors = ['matrix' => ['Matrix not found: '.$args['id']]];
        }
        if (!$errors) {
            $deleted = (isset($data['force']) && !empty($data['force'])) ? $matrix->forceDelete() : $matrix->delete();
            return $response->withJson(['success' => true, 'id' => $args['id']], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /matrixes/{id}/institution
    // Get a matrix's institution
    public function institution(Request $request, Response $response, $args) {
        $errors = [];
        $institution = Matrix::find($args['id'])->institution()->get();

        if (!$errors && !$institution) {
            $errors = ['matrix' => ['Matrix not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $institution], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /matrixes/{id}/user
    // Get a matrix's user
    public function user(Request $request, Response $response, $args) {
        $errors = [];
        $user = Matrix::find($args['id'])->user()->get();

        if (!$errors && !$user) {
            $errors = ['user' => ['User not found: '.$args['id']]];
        }

        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $user], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }
}