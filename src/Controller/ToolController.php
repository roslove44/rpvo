<?php

namespace App\Controller;

use App\Form\CalculatorForPrematureFormType;
use App\Service\CalculatorForPrematureService;
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
    public function calculatorForPremature(Request $request, CalculatorForPrematureService $calcFPS): Response
    {
        $calculatorForPrematureForm = $this->createForm(CalculatorForPrematureFormType::class);
        $calculatorForPrematureForm->handleRequest($request);
        $fixedAge = null;

        if (
            $calculatorForPrematureForm->isSubmitted() && $calculatorForPrematureForm->isValid()
        ) {
            extract($calculatorForPrematureForm->getData());
            $fixedAge = $calcFPS->calcFixedAge($birthday, $termSA);
            $realAge = $calcFPS->calcRealAge($birthday);
            dd($fixedAge, $realAge);
        }

        $calculatorForPrematureForm = $calculatorForPrematureForm->createView();
        return $this->render('tool/calculatorForPremature.html.twig', compact('calculatorForPrematureForm', 'fixedAge'));
    }
}
