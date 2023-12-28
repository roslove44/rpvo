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

    public function calcFixedAge(DateTime $birthday, int $termSA): DateInterval
    {
        // Calcul de l'âge corrigé
        $prematurityWeeks = (40 - $termSA);
        $prematurityWeeks = new DateInterval("P{$prematurityWeeks}W");
        $fixedDate = new DateTime($birthday->format('Y-m-d'));
        $fixedDate->add($prematurityWeeks);
        $fixedAge = $this->currentDate->diff($fixedDate);

        return ($fixedAge);
    }

    public function calcRealAge(DateTime $birthday): DateInterval
    {
        // Calcul de l'âge réel
        $realAge = $this->currentDate->diff($birthday);

        return ($realAge);
    }
}
