<?php
namespace App;

use \App\Config\Config;

class Middleware {
    private $app;
    private $container;
    
    function __construct($app) {
        $this->app = $app;
        $container = $app->getContainer(); // Dependency injection container
        $this->container = $container;
        $this->cors();
        $this->jwt();
    }
    
    // CORS
    function cors() {
        $this->app->add(function ($req, $res, $next) {
            $response = $next($req, $res);
            return $response->withHeader('Access-Control-Allow-Origin', '*')
                    ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
                    ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                    ->withHeader('Access-Control-Expose-Headers', 'content-range');
        });
    }
    
    // JWT Authentication (tuupola/slim-jwt-auth)
    function jwt() {
        $prefix = Config::prefix();
        $this->container->get('db'); // JWT middleware callbacks dependent on DB, make sure Eloquent is initalized
        $this->app->add(new \Tuupola\Middleware\JwtAuthentication([
            "attribute" => "jwt",
            "path" => [$prefix],
            "ignore" => [$prefix. "/users/register", $prefix."/users/login"],
            "secret" => \App\Config\Config::auth()['secret'],
            "logger" => $this->container['logger'],
            "error" => function ($response, $arguments) {
                return $response
                    ->withHeader('Access-Control-Allow-Origin', '*')
                    ->withJson([
                        'success' => false,
                        'errors' => ['auth' => ['Błąd podczas autoryzacji']]
                ], 401);
            },
            "before" => function ($request, $arguments) {
                $user = \App\Models\User::find($arguments['decoded']['sub']);
                return $request->withAttribute("user", $user);
            }
        ]));
    }
}