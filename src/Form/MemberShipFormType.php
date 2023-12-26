<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
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
            ->add('activity', TextType::class, [
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
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Précisez votre lieu de travail'
                ]
            ])
            ->add('address', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Adresse professionnelle'
                ]
            ])
            ->add('zipCode', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Code Postal'
                ]
            ])
            ->add('town', TextType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Ville'
                ]
            ])
            ->add('proPhoneNumber', TelType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Numéro de téléphone professionnel'
                ]
            ])
            ->add('phoneNumber', TelType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Numéro de téléphone portable'
                ]
            ])
            ->add('fieldEmail', EmailType::class, [
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Votre adresse électronique'
                ]
            ])
            ->add('auth', CheckboxType::class, [
                'label' => "J'autorise le réseau à communiquer mes coordonnées aux autres membres de l'association",
                'attr' => [
                    'class' => '',
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'required' => true
        ]);
    }
}
