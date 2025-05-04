import React from 'react';
import { motion } from 'framer-motion';
import '@/styles/animations.css';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  imageSrc?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, imageSrc }) => {
  return (
    <div className="text-center py-8">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-muted-foreground opacity-40 mb-2">{icon}</div>
        <p className="text-muted-foreground font-medium">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}

        {imageSrc && (
          <div className="mt-6 opacity-70">
            <img src={imageSrc} alt={title} className="h-32 w-auto mx-auto float-animation" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmptyState;
