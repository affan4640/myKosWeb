<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = ['user_one_id', 'user_two_id', 'last_message_at'];

    public function userOne()
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo()
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class, 'conversation_id')->latest();
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id');
    }
}