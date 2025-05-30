import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-4">Página não encontrada</p>
        <p className="text-gray-500 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button onClick={() => navigate(-1)} variant="outline">
            Voltar
          </Button>
          <Button onClick={() => navigate('/')} variant="default">
            Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
