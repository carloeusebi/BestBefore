<?php

declare(strict_types=1);

namespace App\Enums;

enum Category: string
{
    /** Prodotti lattiero-caseari come latte, yogurt, formaggi freschi */
    case DAIRY = 'dairy';

    /** Carni fresche, pollame e prodotti a base di carne */
    case MEAT = 'meat';

    /** Pesce fresco e frutti di mare */
    case SEAFOOD = 'seafood';

    /** Prodotti da forno freschi come pane e dolci */
    case BAKERY = 'bakery';

    /** Piatti pronti freschi e gastronomia */
    case DELI = 'deli';

    /** Uova e ovoprodotti freschi */
    case EGGS = 'eggs';

    /** Salumi e affettati */
    case COLD_CUTS = 'cold_cuts';

    /** Insalate pronte e verdure confezionate */
    case READY_TO_EAT = 'ready_to_eat';

    /** Biscotti e merendine per la colazione */
    case BREAKFAST_SNACKS = 'breakfast_snacks';

    /** Snack e salatini confezionati */
    case SAVORY_SNACKS = 'savory_snacks';

    public static function random(): self
    {
        /** Using cryptographically secure random_int for better randomization */
        $cases = self::cases();

        return $cases[random_int(0, count($cases) - 1)];
    }

    /**
     * Returns the Italian user-friendly label for the category
     */
    public function getLabel(): string
    {
        return match ($this) {
            self::DAIRY => 'Latticini',
            self::MEAT => 'Carne',
            self::SEAFOOD => 'Pesce',
            self::BAKERY => 'Prodotti da forno',
            self::DELI => 'Gastronomia',
            self::EGGS => 'Uova',
            self::COLD_CUTS => 'Salumi',
            self::READY_TO_EAT => 'Piatti pronti',
            self::BREAKFAST_SNACKS => 'Biscotti e merendine',
            self::SAVORY_SNACKS => 'Snack salati',
        };
    }
}
