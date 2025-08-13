import { Milk, Beef, Fish, Wheat, ChefHat, Egg, Sandwich, Salad, Cookie, Pizza } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

export type CategoryItem = {
    value: string;
    label: string;
    icon: LucideIcon;
};

export type Categories = {
    items: CategoryItem[];
    getCategory(value: string): CategoryItem | undefined;
};

export const categories = {
    getCategory(value: string | null): CategoryItem | undefined {
        return this.items.find((item) => item.value === value);
    },
    items: [
        {
            value: 'dairy',
            label: 'Latticini',
            icon: Milk,
        },
        {
            value: 'meat',
            label: 'Carne',
            icon: Beef,
        },
        {
            value: 'seafood',
            label: 'Pesce',
            icon: Fish,
        },
        {
            value: 'bakery',
            label: 'Prodotti da forno',
            icon: Wheat,
        },
        {
            value: 'deli',
            label: 'Gastronomia',
            icon: ChefHat,
        },
        {
            value: 'eggs',
            label: 'Uova',
            icon: Egg,
        },
        {
            value: 'cold_cuts',
            label: 'Salumi',
            icon: Sandwich,
        },
        {
            value: 'ready_to_eat',
            label: 'Piatti pronti',
            icon: Salad,
        },
        {
            value: 'breakfast_snacks',
            label: 'Biscotti e merendine',
            icon: Cookie,
        },
        {
            value: 'savory_snacks',
            label: 'Snack salati',
            icon: Pizza,
        },
    ],
    getIcon(category: string | null): LucideIcon | undefined {
        return this.items.find((item) => item.value === category)?.icon;
    },
};
