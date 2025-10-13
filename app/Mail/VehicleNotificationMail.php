<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class VehicleNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $vehicles;
    public $lastDigit;
    public $notificationDate;

    /**
     * Create a new message instance.
     */
    public function __construct(Collection $vehicles, int $lastDigit, string $notificationDate)
    {
        $this->vehicles = $vehicles;
        $this->lastDigit = $lastDigit;
        $this->notificationDate = $notificationDate;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Monthly Vehicle Notification - Plate Numbers Ending in ' . $this->lastDigit,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.vehicle-notification',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
