<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\GreaterThan;
use Symfony\Component\Validator\Constraints\LessThanOrEqual;

class CalculatorForPrematureFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $defaultDate = new \DateTime();

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
                    new GreaterThan(value: 0, message: 'La valeur doit être supérieure ou égale à zéro.'),
                    new LessThanOrEqual(value: 40, message: 'La valeur doit être inférieure ou égale à 40.')
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
