<?php
namespace App\Routes;

use \App\Config\Config;

class Matrix {
    function __construct($app) {
        $prefix = Config::prefix();

        $app->get($prefix . '/matrixes', '\App\Controllers\MatrixController:all');
        $app->get($prefix . '/matrixes/{id}', '\App\Controllers\MatrixController:find');
        $app->post($prefix . '/matrixes', '\App\Controllers\MatrixController:create');
        $app->put($prefix . '/matrixes/{id}', '\App\Controllers\MatrixController:update');
        $app->delete($prefix . '/matrixes/{id}', '\App\Controllers\MatrixController:delete');
        $app->get($prefix . '/matrixes/{id}/institution', '\App\Controllers\MatrixController:institution');
        $app->get($prefix . '/matrixes/{id}/user', '\App\Controllers\MatrixController:user');
    }
}