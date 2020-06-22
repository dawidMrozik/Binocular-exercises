<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use LangleyFoxall\EloquentReportGenerator\Traits\Reportable;

class Result extends Model {
    use SoftDeletes; // toggle soft deletes
    use Reportable;
    
    protected $table = 'results';
    protected $fillable = ['duration', 'points_missed', 'red_points', 'green_points', 'patient_id', 'user_id', 'matrix_id', 'institution_id','completed']; // for mass creation
    protected $hidden = ['deleted_at']; // hidden columns from select results
    protected $dates = ['deleted_at']; // the attributes that should be mutated to dates
    public static function boot() {
        parent::boot();
        // setup model event listeners
        static::setEventDispatcher(new \Illuminate\Events\Dispatcher());
        // static::deleting(['\App\Models\Events\Category', 'delete']); // DELETE event listener
    }
    
    public function patient() {
        return $this->belongsTo('\App\Models\Patient');
    }

    public function user() {
        return $this->belongsTo('\App\Models\User');
    }

    public function matrix() {
        return $this->belongsTo('\App\Models\Matrix');
    }

    public function institution() {
        return $this->belongsTo('\App\Models\Institution');
    }
}