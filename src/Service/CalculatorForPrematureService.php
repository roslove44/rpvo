<?php

namespace App\Service;

use DateInterval;
use DateTime;

class CalculatorForPrematureService
{
    private $currentDate;

    public function __construct()
    {
        $this->currentDate = new DateTime();
    }

    public function calcFixedAge(DateTime $birthday, int $termSA, int $termSADays = 0): string
    {
        // Calcul de l'âge corrigé
        $prematurityWeeks = (40 - $termSA);
        $prematurityWeeks = new DateInterval("P{$prematurityWeeks}W");
        $prematurityDays = new DateInterval("P{$termSADays}D");
        $fixedDate = new DateTime($birthday->format('Y-m-d'));
        $fixedDate->add($prematurityWeeks)->sub($prematurityDays);
        $fixedAge = $fixedDate->diff($this->currentDate);

        // Déterminer la nature de la date corrigée (passée ou future)
        $nature = ($fixedDate > $this->currentDate) ? -1 : 1;


        return $this->formatAge($fixedAge, $nature);
    }

    public function calcRealAge(DateTime $birthday): string
    {
        // Calcul de l'âge réel
        $realAge = $this->currentDate->diff($birthday);

        return $this->formatAge($realAge);
    }

    private function formatAge(DateInterval $interval, $nature = 0): string
    {
        $y = $interval->y;
        $m = $interval->m;
        $d = $interval->d;
        $nature < 0 ? $separator = '-' : $separator = '';
        $result = '';

        if ($y > 0) {
            $result .= $y > 1 ? "$separator $y ans" : "$separator $y an ";
        }
        if ($m > 0) {
            $result .= "$separator $m mois ";
        }
        if ($d > 0) {
            $result .= $d > 1 ? "$separator $d jours" : "$separator $d jour";
        }

        return $result;
    }
}
