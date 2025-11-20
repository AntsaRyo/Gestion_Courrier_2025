<?php

namespace App\Notifications;

use App\Models\Arrive;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NouvelleAssignation extends Notification
{
    use Queueable;

    protected $courrier;

    public function __construct(Arrive $courrier)
    {
        $this->courrier = $courrier;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouveau courrier à dispatcher')
            ->greeting('Bonjour,')
            ->line('Détails du Courrier :')
            ->line('----------------------------')
            ->line('Numéro de Correspondance : ' . $this->courrier->numero_correspondance_arrive)
            ->line('Provenance : ' . $this->courrier->Provenance)
            ->line('Date d\'Arrivée : ' . $this->courrier->DateArrive)
            ->line('Bureau : ' . $this->courrier->Destinataire)
            ->line('----------------------------')
            ->line('Veuillez vous connecter à l\'application pour assigner ce courrier.')
            ->salutation('Merci');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
