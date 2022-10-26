<?php

namespace Afeefa\ApiResources\Test\Fixtures\Blog\Models;

use Afeefa\ApiResources\Eloquent\Model as EloquentModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Author extends EloquentModel
{
    use HasFactory;

    public static $type = 'Blog.Author';

    public $timestamps = false;

    protected $table = 'authors';

    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
