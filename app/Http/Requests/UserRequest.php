<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'Matricule' => 'required|string|unique:users,Matricule',
            'Nom' => 'required|string|[A-Z]',
            'Prenom' => 'required|string',
            'role' => 'required|in:admin,secretaire',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|confirmed|min:8'
        ];
    }
}
