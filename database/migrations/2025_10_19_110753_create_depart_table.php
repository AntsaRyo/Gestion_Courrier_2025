<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('depart', function (Blueprint $table) {
            $table->id('Numero_Depart');
            $table->integer('Numero_Correspondance_Depart');
            $table->date('Date_Depart');
            $table->string('Objet_Depart');
            $table->string('Destinataire');
            $table->integer('Nombre_Pieces_Jointes_Depart');
            $table->string('Etat_depart')->default('Non Validé');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depart');
    }
};
