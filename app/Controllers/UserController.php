<?php
namespace App\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Includes\ValidationRules as ValidationRules;
use \App\Models\User as User;

class UserController {
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

    // GET /user
    // Get logged user info
    public function user(Request $request, Response $response) {
        $jwt = $request->getAttribute('jwt');
        if($jwt) {
            return $response->withJson([
                'user' => $request->getAttribute('user')
            ]);
        } else {
            return $response->withJson([
                'success' => false,
                'error' => ['token' => ['Authorization error']]
            ], 400);
        }
    }

    // GET /users
    // Get all users
    public function users(Request $request, Response $response) {
        $users = User::all();

        return $response->withJson(['data' => $users], 200);
    }

    // POST /users
    // Create user
    public function create(Request $request, Response $response) {
        $this->logger->addInfo('POST /users');
        $data = $request->getParsedBody();
        $errors = [];
        // The validate method returns the validator instance
        $validator = $this->validator->validate($request, ValidationRules::usersPost());
        if (!$validator->isValid()) {
            $errors = $validator->getErrors();
        }
        if (!$errors && User::where(['email' => $data['email']])->first()) {
            $errors = ['email' => ['User with a given email already exists']];
        }
        if (!$errors) {
            // Input is valid, so let's do something...
            $newUser = User::create([
                'firstname' => $data['firstname'],
                'lastname' => $data['lastname'],
                'email' => $data['email'],
                'password' => $data['password']
            ]);
            return $response->withJson([
                'success' => true,
                'id' => $newUser->id
            ], 200);
        } else {
            // Error occured
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }
    
    // POST /users/login
    public function login(Request $request, Response $response) {
        $this->logger->addInfo('POST /users/login');
        $data = $request->getParsedBody();
        $errors = [];
        $validator = $this->validator->validate($request, ValidationRules::authPost());
        // Validate input
        if (!$validator->isValid()) {
            $errors = $validator->getErrors();
        }
        // validate username
        if (!$errors && !($user = User::where(['email' => $data['email']])->first())) {
            $errors = ['auth' => ['Incorrect login credentials']];
        }
        // validate password
        if (!$errors && !password_verify($data['password'], $user->password)) {
            $errors = ['auth' => ['Incorrect login credentials']];
        }
        if (!$errors) {
            // No errors, generate JWT
            $token = $user->tokenCreate();
            // return token
            return $response->withJson([
                "success" => true,
                "data" => [
                    "token" => $token['token'],
                    "expires" => $token['expires'],
                    "user" => $user
                ]
            ], 200);
        } else {
            // Error occured
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }

    // GET /users/{id}/institution
    // Get a users institution
    public function institutions(Request $request, Response $response, $args) {
        $errors = [];
        $institution = User::find($args['id'])->institutions()->get();

        if (!$errors && !$institution) {
            $errors = ['user' => ['User not found: '.$args['id']]];
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

    // GET /users/{id}/result
    // Get a users result
    public function results(Request $request, Response $response, $args) {
        $errors = [];
        $result = User::find($args['id']);

        if (!$errors && !$result) {
            $errors = ['user' => ['User not found: '.$args['id']]];
        } else {
            $queries = $request->getQueryParams();

            if(array_key_exists('latest', $queries)) {
                $count = $queries['latest'];
                $result = $result->results()->latest()->take($count)->with('matrix')->with('patient')->with('institution')->get();
            } else {
                $result = $result->results()->with('matrix')->with('patient')->with('institution')->get();
            }
        }


        if (!$errors) {
            return $response->withJson(['success' => true, 'data' => $result], 200);
        } else {
            // Errors found
            return $response->withJson([
                'success' => false,
                'errors' => $errors
            ], 400);
        }
    }
}