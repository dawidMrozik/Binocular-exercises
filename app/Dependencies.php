<?php
namespace App;

class Dependencies {
    private $container;
    
    function __construct($app) {
        $container = $app->getContainer(); // Dependency injection container
        $this->container = $container;
        $this->dependencies(); // Load dependencies into container
        $this->inject($app); // Inject dependencies into controllers
        $this->handlers(); // Set custom handlers
    }
    
    // Setup dependency container
    function dependencies() {
        // Monolog
        $this->container['logger'] = function($c) {
            $logger = new \Monolog\Logger('myLogger');
            $file_handler = new \Monolog\Handler\StreamHandler('../logs/app.log');
            $logger->pushHandler($file_handler);
            return $logger;
        };
        // Eloquent ORM
        $this->container['db'] = function($c) {
            $capsule = new \Illuminate\Database\Capsule\Manager;
            $capsule->addConnection($c['settings']['db']);

            $capsule->setAsGlobal();
            $capsule->bootEloquent();

            return $capsule;
        };
        // awurth/SlimValidation
        $this->container['validator'] = function($c) {
            return new \Awurth\SlimValidation\Validator();
        };
    }
    
    // Inject dependencies into controllers
    function inject($app) {
        // User
        $this->container['\App\Controllers\UserController'] = function($c) use ($app) {
            return new \App\Controllers\UserController($c->get('logger'), $c->get('db'), $c->get('validator'));
        };
        // Todo
        $this->container['\App\Controllers\TodoController'] = function($c) use ($app) {
            return new \App\Controllers\TodoController($c->get('logger'), $c->get('db'), $c->get('validator'));
        };
        // Category
        $this->container['\App\Controllers\CategoryController'] = function($c) use ($app) {
            return new \App\Controllers\CategoryController($c->get('logger'), $c->get('db'), $c->get('validator'));
        };
        // Institution
        $this->container['\App\Controllers\InstitutionController'] = function($c) use ($app) {
            return new \App\Controllers\InstitutionController($c->get('logger'), $c->get('db'), $c->get('validator'));
        };
        // Patient
        $this->container['\App\Controllers\PatientController'] = function($c) use ($app) {
            return new \App\Controllers\PatientController($c->get('logger'), $c->get('db'), $c->get('validator'));
        };
        // Matrix
        $this->container['\App\Controllers\MatrixController'] = function($c) use ($app) {
            return new \App\Controllers\MatrixController($c->get('logger'), $c->get('db'), $c->get('validator'));
        };
        // Result
        $this->container['\App\Controllers\ResultController'] = function($c) use ($app) {
            return new \App\Controllers\ResultController($c->get('logger'), $c->get('db'), $c->get('validator'));
        };
    }
    
    // Custom handlers
    function handlers() {
        // 404 custom response
        $this->container['notFoundHandler'] = function($c) {
            return function($request, $response) use ($c) {
                return $c['response']
                    ->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                    ->withHeader('Access-Control-Expose-Headers', 'content-range')
                    ->withJson(['errors' => ['404' => ['Zasób nie znaleziony']]], 404);
            };
        };
    }
}