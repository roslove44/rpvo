<?php

namespace App\Service;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class SendMailService
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function send(string $from, string $to, string $subject, string $template, array $context, string $replyTo = null): void
    {
        $from = new Address($from, 'Test Contact RPVO');
        // On crée le mail 
        if ($replyTo) {
            $email = (new TemplatedEmail())
                ->from($from)
                ->to($to)
                ->subject($subject)
                ->htmlTemplate("Email/$template.html.twig")
                ->replyTo($replyTo)
                ->context($context);
        } else {
            $email = (new TemplatedEmail())
                ->from($from)->to($to)
                ->subject($subject)
                ->htmlTemplate("Email/$template.html.twig")
                ->context($context);
        }


        // On envoie le mail 
        $this->mailer->send($email);
    }
}
