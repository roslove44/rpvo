<?php

namespace App\Controller;

use App\Form\ContactComingType;
use App\Form\ContactType;
use App\Service\SendMailService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    #[Route('/', name: 'app_main')]
    public function index(): Response
    {
        return $this->render('accueil/index.html.twig');
    }
    #[Route('/accueil', name: 'app_main_home')]
    public function home(): Response
    {
        return $this->render('accueil/index.html.twig');
    }

    #[Route('/contact', name: 'app_main_contact')]
    public function contact(Request $request, SendMailService $mailer): Response
    {
        $contactForm = $this->createForm(ContactType::class);
        $contactForm->handleRequest($request);

        if ($contactForm->isSubmitted() && $contactForm->isValid()) {
            $data = $contactForm->getData();
            $mailer->send(
                'contact@rpvo.org',
                'contact@rpvo.org',
                $data['subject'],
                'contact',
                $data,
                $data['fieldEmail']
            );
            $this->addFlash('contactSuccess', "Votre message a bien été reçu. Merci !");
            return $this->redirectToRoute('app_main_contact');
        }

        $contactForm = $contactForm->createView();
        return $this->render('accueil/contact.html.twig', compact('contactForm'));
    }
}
