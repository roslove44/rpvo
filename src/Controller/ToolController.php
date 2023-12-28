<?php

namespace App\Controller;

use App\Form\CalculatorForPrematureFormType;
use DateInterval;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ToolController extends AbstractController
{
    #[Route('/outils', name: 'app_tool')]
    public function index(): Response
    {
        return $this->render('tool/index.html.twig', []);
    }

    #[Route('/outils/calculateur-age-reel-age-corrige-pour-prematures', name: 'app_tool_calculatorForPremature')]
    public function calculatorForPremature(Request $request): Response
    {
        $calculatorForPrematureForm = $this->createForm(CalculatorForPrematureFormType::class);
        $calculatorForPrematureForm->handleRequest($request);
        $fixedAge = null;

        if (
            $calculatorForPrematureForm->isSubmitted() && $calculatorForPrematureForm->isValid()
        ) {
            extract($calculatorForPrematureForm->getData());
            $currentDate = new DateTime();

            // Calcul de l'âge réel
            $realAge = $birthday->diff($currentDate);

            // Calcul de l'âge corrigé
            $prematurityWeeks = (40 - $termSA);
            $prematurityWeeks = new DateInterval("P{$prematurityWeeks}W");
            $birthdayClone = clone $birthday;
            $fixedDate = $birthdayClone->sub($prematurityWeeks);
            $fixedAge = $fixedDate->diff($currentDate);

            dd($birthday, $realAge->format('%y an(s), %m mois, %d jour(s)'), $fixedAge);
        }

        $calculatorForPrematureForm = $calculatorForPrematureForm->createView();
        return $this->render('tool/calculatorForPremature.html.twig', compact('calculatorForPrematureForm', 'fixedAge'));
    }
}
