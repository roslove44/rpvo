<?php

namespace App\Controller;

use App\Form\ContactComingType;
use App\Service\SendMailService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ComingSoonController extends AbstractController
{
    #[Route('/', name: 'app_coming_soon')]
    public function index(Request $request, SendMailService $mailer): Response
    {
        $contactForm = $this->createForm(ContactComingType::class);
        $contactForm->handleRequest($request);
        if ($contactForm->isSubmitted() && $contactForm->isValid()) {
            $data = $contactForm->getData();

            $mailer->send(
                "contact@rpvo.org",
                "contact@rpvo.org",
                $data['subject'],
                'comingSoon',
                $data,
                $data['clientEmail']
            );

            $this->addFlash('comingSoon', "&check; Votre demande a bien été reçue.");
            return $this->redirectToRoute('app_coming_soon');
        }

        $contactForm = $contactForm->createView();
        return $this->render('coming_soon/index.html.twig', compact('contactForm'));
    }
}
