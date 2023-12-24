<?php

namespace App\Controller;

use App\Form\ContactComingType;
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
    public function contact(): Response
    {
        return $this->render('accueil/contact.html.twig');
    }
}
