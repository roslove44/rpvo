<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class Ivg_ContraceptionController extends AbstractController
{
    #[Route('/ivg-contraception', name: 'app_ivg_contraception')]
    public function index(): Response
    {
        return $this->render('infos/ivg-contraception/index.html.twig', [
            'controller_name' => 'InfoController',
        ]);
    }
}
