<?php
namespace App;

class App {
    private $app;
    
    public function __construct() {
        // initalize Slim App
        $app = new \Slim\App(\App\Config\Config::slim());
        $this->app = $app;
        // initalize dependencies
        $this->dependencies();
        // initalize middlewares
        $this->middleware();
        // initalize routes
        $this->routes();
    }
    
    public function get() {
        return $this->app;
    }
    
    private function dependencies() {
        return new \App\Dependencies($this->app);
    }
    
    private function middleware() {
        return new \App\Middleware($this->app);
    }
    
    private function routes() {
        return [
            new \App\Routes\User($this->app),
            new \App\Routes\Institution($this->app),
            new \App\Routes\Patient($this->app),
            new \App\Routes\Matrix($this->app),
            new \App\Routes\Result($this->app)
        ];
    }
}