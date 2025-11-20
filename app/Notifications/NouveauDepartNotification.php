<?php

namespace App\Notifications;

use App\Models\Depart;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NouveauDepartNotification extends Notification
{
    use Queueable;

    protected $courrier;

    public function __construct(Depart $courrier)
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
            ->subject('Un nouveau courrier à valider')
            ->greeting('Bonjour,')
            ->line('Un nouveau courrier nécessite une validation.')
            ->line('Détails du Courrier :')
            ->line('----------------------------')
            ->line('Numéro de Correspondance : ' . $this->courrier->numero_correspondance_depart)
            ->line('Destinataire : ' . $this->courrier->DestinataireDepart)
            ->line('Date d\'Envoi : ' . $this->courrier->DateDepart)
            ->line('Objet : ' . $this->courrier->ObjetDepart)
            ->line('----------------------------')
            ->line('Veuillez vous connecter à l\'application pour valider ce courrier.')
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
