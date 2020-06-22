<?php
namespace App\Routes;

use \App\Config\Config;

class User {
    function __construct($app) {
        $prefix = Config::prefix();

        $app->post($prefix . '/users/register', '\App\Controllers\UserController:create');
        $app->post($prefix . '/users/login', '\App\Controllers\UserController:login');
        $app->get($prefix . '/user', '\App\Controllers\UserController:user');
        $app->get($prefix . '/users', '\App\Controllers\UserController:users');
        $app->get($prefix . '/users/{id}/institutions', '\App\Controllers\UserController:institutions');
        $app->get($prefix . '/users/{id}/results', '\App\Controllers\UserController:results');
    }
}