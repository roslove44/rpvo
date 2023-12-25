<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MemberShipFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('civility', ChoiceType::class, [
                'placeholder' => 'Civilité ...',
                'choices' => [
                    'Madame' => 'Madame',
                    'Mademoiselle' => 'Mademoiselle',
                    'Monsieur' => 'Monsieur',
                ],
                'attr' => [
                    'class' => 'form-select'
                ]
            ])
            ->add('surname', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Nom'
                ]
            ])
            ->add('firstname', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Prénom'
                ]
            ])
            ->add('profession', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Profession'
                ]
            ])
            ->add('office', ChoiceType::class, [
                'placeholder' => 'Lieu d\'exercice',
                'attr' => [
                    'class' => 'form-select',
                ],
                'choices' => [
                    'Cabinet' => 'Cabinet',
                    'Hôpital' => 'Hôpital',
                    'PMI' => 'PMI',
                    'Autre' => 'Autre'
                ],
                'multiple' => false,
            ])
            ->add('otherOffice', TextType::class, [
                'required' => false,
                'mapped' => false,
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Précisez votre lieu de travail'
                ]
            ])
            ->add('fieldEmail', EmailType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Votre Email'
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
