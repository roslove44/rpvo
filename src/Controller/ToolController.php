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
    #[Route('calculateur-age-reel-age-corrige-pour-prematures', name: 'app_tool_calculatorForPremature')]
    public function calculatorForPremature(Request $request, CalculatorForPrematureService $calcFPS): Response
    {
        $calculatorForPrematureForm = $this->createForm(CalculatorForPrematureFormType::class);
        $calculatorForPrematureForm->handleRequest($request);
        $fixedAge = null;
        $realAge = null;
        $result = false;
        $data = null;

        if (
            $calculatorForPrematureForm->isSubmitted() && $calculatorForPrematureForm->isValid()
        ) {
            $data = $calculatorForPrematureForm->getData();
            extract($data);
            $termSADays = $termSADays ? $termSADays : 0;
            $fixedAge = $calcFPS->calcFixedAge($birthday, $termSA, $termSADays);
            $realAge = $calcFPS->calcRealAge($birthday);
            $result = true;
        }

        $calculatorForPrematureForm = $calculatorForPrematureForm->createView();
        return $this->render('tool/calculatorForPremature.html.twig', compact('calculatorForPrematureForm', 'fixedAge', 'realAge', 'result', 'data'));
    }

    #[Route('calendrier-de-grossesse-personnalise', name: 'app_tool_obstetricalCastor')]
    public function obstetricalCastor(Request $request): Response
    {
        return $this->render('tool/obstetricalCastor.html.twig');
    }

    #[Route('echelle-scoree-epds', name: 'app_tool_echelleScoreeEpds')]
    public function echelleScoreeEpds(Request $request): Response
    {
        return $this->redirect('https://rpvo.mlc-site.fr/outils-pratiques/echelle-scoree-epds/');
    }

    #[Route('calendrier-de-grossesse', name: 'app_tool_PregnancyCalendar')]
    public function PregnancyCalendar(Request $request): Response
    {
        $result = false;
        if ($request->isMethod('POST')) {
            // Récupérez les données du formulaire
            $lastMenstrualDate = $request->request->get('lastMenstrualDate');
            $lastMenstrualDateTime = new DateTime($lastMenstrualDate);
            $cycleDuration = $request->request->get('cycleDuration');
            $cycleIncidence = 287 + $cycleDuration - 28;

            $gestationPeriod = new DateInterval("P" . $cycleIncidence . "D");



            $estimatedDueDate = clone $lastMenstrualDateTime;
            $estimatedDueDate->add($gestationPeriod);
            $today = new DateTime();
            $differenceInDays = $today->diff($estimatedDueDate)->days + 1;

            // Date de la première échographie
            $firstUltrasoundDate = [
                "min" => (clone $lastMenstrualDateTime)->add(new DateInterval("P12W"))->sub(new DateInterval("P1D")),
                "max" => (clone $lastMenstrualDateTime)->add(new DateInterval("P14W"))->sub(new DateInterval("P1D"))
            ];

            $secondUltrasoundDate = [
                "min" => (clone $lastMenstrualDateTime)->add(new DateInterval("P20W")),
                "max" => (clone $lastMenstrualDateTime)->add(new DateInterval("P22W"))
            ];

            $thirdUltrasoundDate = [
                "min" => (clone $lastMenstrualDateTime)->add(new DateInterval("P30W")),
                "max" => (clone $lastMenstrualDateTime)->add(new DateInterval("P32W"))
            ];


            $trimester = $this->determineTrimester($differenceInDays);
            $result = [
                "lastMenstrualDate" => $lastMenstrualDate,
                "cycleDuration" => $cycleDuration,
                "cycleIncidence" => $cycleIncidence,
                "estimatedDueDate" => $estimatedDueDate,
                "differenceInDays" => $differenceInDays,
                "firstUltrasoundDate" => $firstUltrasoundDate,
                "secondUltrasoundDate" => $secondUltrasoundDate,
                "thirdUltrasoundDate" => $thirdUltrasoundDate,
                "trimester" => $trimester
            ];
        }
        return $this->render('tool/pregnancyCalendar.html.twig', compact('result'));
    }

    private function determineTrimester($daysPregnant)
    {
        if ($daysPregnant <= 13 * 7) {
            return [
                'rank' => 3,
                'title' => "Troisième trimestre"
            ];
        } elseif ($daysPregnant <= 26 * 7) {
            return [
                'rank' => 2,
                'title' => "Deuxième trimestre"
            ];
        } else {
            return [
                'rank' => 1,
                'title' => "Premier trimestre"
            ];
        }
    }
}
