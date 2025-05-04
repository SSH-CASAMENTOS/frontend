import React from 'react';
import { WeddingList } from '@/components/dashboard/WeddingList';
import { PaymentStatus } from '@/components/dashboard/PaymentStatus';
import { Wedding } from '@/types';

interface WeddingSectionProps {
  weddings: Wedding[];
  activeWedding: Wedding | null;
  onSelectWedding: (wedding: Wedding) => void;
}

export const WeddingSection: React.FC<WeddingSectionProps> = ({
  weddings,
  activeWedding,
  onSelectWedding,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <WeddingList weddings={weddings} onSelectWedding={onSelectWedding} />
      </div>
      <div>
        {activeWedding && (
          <PaymentStatus totalBudget={activeWedding.budget} totalPaid={activeWedding.totalPaid} />
        )}
      </div>
    </div>
  );
};
