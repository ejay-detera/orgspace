<?php

namespace App\Mail;

use App\Models\Announcement;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CriticalAnnouncementMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Announcement $announcement
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[CRITICAL] ' . $this->announcement->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.critical_announcement',
        );
    }
}
