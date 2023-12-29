<?php

namespace App\Form;

use DateTimeZone;
use PhpParser\Node\Expr\BinaryOp\GreaterOrEqual;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\GreaterThan;
use Symfony\Component\Validator\Constraints\GreaterThanOrEqual;
use Symfony\Component\Validator\Constraints\LessThanOrEqual;

class CalculatorForPrematureFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $defaultDate = new \DateTime("now", new DateTimeZone('Europe/Paris'));

        $builder
            ->add('currentDate', DateType::class, [
                'label' => 'Date du jour',
                'widget' => 'single_text',
                'attr' => [
                    'class' => 'form-control'
                ],
                'data' => $defaultDate, // Définir la date du jour par défaut
                'disabled' => true,
            ])
            ->add('birthday', BirthdayType::class, [
                'label' => 'Date de naissance',
                'widget' => 'single_text',
                'attr' => [
                    'class' => 'form-control'
                ],
                'constraints' => [
                    new LessThanOrEqual(value: $defaultDate, message: 'La date de naissance ne peut pas être postérieure à la date d\'aujourd\'hui.')
                ]
            ])
            ->add('termSA', IntegerType::class, [
                'label' => 'Terme SA',
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'ex.30'
                ],
                'constraints' => [
                    new GreaterThan(value: 0, message: 'La valeur (Terme SA) doit être supérieure à zéro.'),
                    new LessThanOrEqual(value: 40, message: 'La valeur (Terme SA) doit être inférieure ou égale à 40.')
                ]
            ])->add('termSADays', IntegerType::class, [
                'label' => 'Terme jours',
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'ex.30'
                ],
                'constraints' => [
                    new GreaterThanOrEqual(value: 0, message: 'La valeur (Terme jours) doit être supérieure ou égale à zéro.'),
                ],
                'required' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            "required" => true,
        ]);
    }
}
