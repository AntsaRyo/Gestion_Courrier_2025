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
        Schema::create('arrive', function (Blueprint $table) {
            $table->id('Numero_Arrive');
            $table->date('Date_Arrive');
            $table->string('Provenance');
            $table->integer('Numero_Correspondance_Arrive');
            $table->date('Date_Correspondance_Arrive');
            $table->string('Texte_Corespondance_Arrive');
            $table->integer('Nombre_Pieces_Jointes_Arrive');
            $table->string('Observations');
            $table->string('Etat_arrive')->default('En attente');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arrive');
    }
};
