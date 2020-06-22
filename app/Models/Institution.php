<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institution extends Model {
    use SoftDeletes; // toggle soft deletes
    protected $table = 'institutions';
    protected $fillable = ['name', 'address', 'city', 'postal_code', 'description']; // for mass creation
    protected $hidden = ['deleted_at']; // hidden columns from select results
    protected $dates = ['deleted_at']; // the attributes that should be mutated to dates
    public static function boot() {
        parent::boot();
        // setup model event listeners
        static::setEventDispatcher(new \Illuminate\Events\Dispatcher());
        static::deleting(['\App\Models\Events\Patient', 'delete']);
    }

    public function users() {
        return $this->belongsToMany('\App\Models\User');
    }

    public function patients() {
        return $this->hasMany('\App\Models\Patient', 'institution_id');
    }

    public function matrixes() {
        return $this->hasMany('\App\Models\Matrix', 'institution_id');
    }

    public function results() {
        return $this->hasMany('\App\Models\Result', 'institution_id');
    }
}