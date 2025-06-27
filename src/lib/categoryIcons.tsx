import {
  Utensils,
  Flower2,
  Building2,
  Camera,
  Music,
  Cake,
  GlassWater,
  Car,
  Sparkles,
  Gift,
  Users,
  PartyPopper,
  Scroll,
  Package,
} from 'lucide-react';

export const getCategoryIcon = (categoryName: string) => {
  const categoryMapping: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    Buffet: Utensils,
    Decoração: Flower2,
    Local: Building2,
    Fotografia: Camera,
    Música: Music,
    Bolo: Cake,
    Bebidas: GlassWater,
    Transporte: Car,
    Lembrancinhas: Gift,
    Convidados: Users,
    Festa: PartyPopper,
    Convites: Scroll,
    Presentes: Package,
    Outros: Sparkles,
  };

  return categoryMapping[categoryName] || Sparkles;
};
