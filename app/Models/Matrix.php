<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Matrix extends Model {
    use SoftDeletes; // toggle soft deletes
    protected $table = 'matrixes';
    protected $fillable = ['name', 'difficulty', 'matrixString', 'institution_id', 'user_id', 'red_points', 'green_points']; // for mass creation
    protected $hidden = ['deleted_at']; // hidden columns from select results
    protected $dates = ['deleted_at']; // the attributes that should be mutated to dates
    public static function boot() {
        parent::boot();
        static::setEventDispatcher(new \Illuminate\Events\Dispatcher());
        static::deleting(['\App\Models\Events\Matrix', 'delete']);
    }
    
    public function institution() {
        return $this->belongsTo('\App\Models\Institution');
    }

    public function user() {
        return $this->belongsTo('\App\Models\User');
    }

    public function results() {
        return $this->hasMany('\App\Models\Result', 'matrix_id');
    }
}