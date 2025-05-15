import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const NoWeddingSelected: React.FC = () => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      }}
      initial="hidden"
      animate="show"
    >
      <Card>
        <CardContent className="py-16 text-center">
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FileText className="h-24 w-24 text-muted-foreground opacity-50 mb-4" />
            <p className="text-muted-foreground text-lg">
              Por favor, selecione um casamento para visualizar os contratos.
            </p>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">
              Você pode escolher um casamento através do seletor no topo da página
            </p>

            <div className="mt-6 opacity-70">
              <img
                src="https://illustrations.popsy.co/fuchsia/paper-documents.svg"
                alt="Empty contracts folder"
                className="h-32 w-32 mx-auto"
                style={{
                  animation: 'float 3s ease-in-out infinite',
                }}
              />
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NoWeddingSelected;
