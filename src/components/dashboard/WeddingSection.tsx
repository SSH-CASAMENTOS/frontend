import React from 'react';
import { WeddingList } from '@/components/dashboard/WeddingList';
import { PaymentStatus } from '@/components/dashboard/PaymentStatus';
import { Wedding } from '@/types';

interface WeddingSectionProps {
  weddings: Wedding[];
  onSelectWedding: (wedding: Wedding) => void;
}

export const WeddingSection: React.FC<WeddingSectionProps> = ({
  weddings,
  onSelectWedding,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <WeddingList weddings={weddings} onSelectWedding={onSelectWedding} />
    </div>
  );
};
