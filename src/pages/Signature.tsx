import React from 'react';
import SignatureForm from '@/components/signature/SignatureForm';
import { motion } from 'framer-motion';
import { Signature } from 'lucide-react';

const SignaturePage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-6"
      >
        <Signature className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Assinatura Digital</h1>
      </motion.div>

      <SignatureForm />
    </div>
  );
};

export default SignaturePage;
