import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Download, Pen, X, FileText, Signature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import SignaturePad from 'react-signature-canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface SignatureData {
  name: string;
  timestamp: string;
  terms: string;
  signatureImage?: string;
}

const TERMS_TEXT = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam posuere felis sed lorem interdum, 
in tincidunt massa fringilla. Mauris a dignissim nisi, quis eleifend dolor. Proin sagittis venenatis turpis, 
id porta justo tincidunt quis. Nam quis tellus metus. Curabitur vel libero eu dolor iaculis fermentum. 
Morbi consectetur nec ligula ac posuere. Donec luctus a turpis eu tristique.

Phasellus iaculis dui in dui convallis, eget suscipit nibh elementum. Nunc pulvinar convallis orci, 
vel tincidunt turpis efficitur a. Quisque ac enim euismod, ultrices nisl eget, aliquam arcu. Nam vel neque quis, 
vestibulum ipsum. Fusce facilisis diam ut magna congue pulvinar. Duis id est feugiat, ornare risus vitae, 
elementum ligula. Praesent bibendum placerat nisl, in ullamcorper mauris convallis eu.

Este documento constitui um acordo legal entre você e nossa empresa. Ao assinar este documento,
você concorda com todos os termos e condições descritos acima.
`;

const SignatureForm: React.FC = () => {
  const [name, setName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  const { toast } = useToast();
  const signaturePadRef = useRef<SignaturePad>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const storedSignature = localStorage.getItem('userSignature');
    if (storedSignature) {
      try {
        const parsedData = JSON.parse(storedSignature);
        setSignatureData(parsedData);
      } catch (error) {
        console.error('Error parsing signature data:', error);
      }
    }
  }, []);

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleSign = () => {
    if (!name || !acceptTerms || !signaturePadRef.current) return;

    const timestamp = format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm:ss", {
      locale: ptBR,
    });

    const shortTerms = TERMS_TEXT.substring(0, 100) + '...';
    const signatureImage = signaturePadRef.current.toDataURL();

    const data: SignatureData = {
      name,
      timestamp,
      terms: shortTerms,
      signatureImage,
    };

    localStorage.setItem('userSignature', JSON.stringify(data));
    setSignatureData(data);

    toast({
      title: 'Assinatura concluída',
      description: 'Documento assinado com sucesso!',
    });
  };

  const handleDownloadPDF = () => {
    if (!signatureData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(16);
    pdf.text('Termo de Aceite Digital', pageWidth / 2, 20, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text(`Nome: ${signatureData.name}`, 20, 40);
    pdf.text(`Data/Hora: ${signatureData.timestamp}`, 20, 50);
    pdf.text('Termos aceitos:', 20, 70);

    const terms = pdf.splitTextToSize(TERMS_TEXT, pageWidth - 40);
    pdf.text(terms, 20, 80);

    if (signatureData.signatureImage) {
      pdf.addImage(signatureData.signatureImage, 'PNG', 20, 200, 70, 30);
    }

    pdf.save('termo-aceite.pdf');

    toast({
      title: 'PDF gerado',
      description: 'O documento foi baixado com sucesso!',
    });
  };

  const handlePreviewPDF = () => {
    if (!signatureData) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(16);
    pdf.text('Termo de Aceite Digital', pageWidth / 2, 20, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text(`Nome: ${signatureData.name}`, 20, 40);
    pdf.text(`Data/Hora: ${signatureData.timestamp}`, 20, 50);
    pdf.text('Termos aceitos:', 20, 70);

    const terms = pdf.splitTextToSize(TERMS_TEXT, pageWidth - 40);
    pdf.text(terms, 20, 80);

    if (signatureData.signatureImage) {
      pdf.addImage(signatureData.signatureImage, 'PNG', 20, 200, 70, 30);
    }

    window.open(pdf.output('bloburl'));

    toast({
      title: 'Visualização PDF',
      description: 'O documento foi gerado para visualização!',
    });
  };

  if (signatureData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto"
      >
        <Card className="border-t-4 border-t-primary shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
            <CardTitle className="flex items-center text-green-600">
              <Check className="mr-2" /> Documento Assinado
            </CardTitle>
            <CardDescription>O documento foi assinado digitalmente com sucesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md bg-green-50/50">
                <p className="text-sm mb-1 text-gray-500">Nome Completo:</p>
                <p className="font-medium">{signatureData.name}</p>
              </div>

              <div className="p-4 border rounded-md bg-green-50/50">
                <p className="text-sm mb-1 text-gray-500">Data e Hora:</p>
                <p className="font-medium">{signatureData.timestamp}</p>
              </div>
            </div>

            <div className="p-4 border rounded-md bg-green-50/50">
              <p className="text-sm mb-1 text-gray-500">Trecho dos Termos Aceitos:</p>
              <p className="text-sm italic">{signatureData.terms}</p>
            </div>

            {signatureData.signatureImage && (
              <div className="p-4 border rounded-md bg-green-50/50">
                <p className="text-sm mb-1 text-gray-500">Assinatura:</p>
                <img
                  src={signatureData.signatureImage}
                  alt="Assinatura"
                  className="max-w-[200px] border border-gray-200 rounded-md bg-white"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2 pb-6 px-6">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('userSignature');
                setSignatureData(null);
              }}
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar Assinatura
            </Button>
            <Button variant="outline" onClick={handlePreviewPDF} className="w-full sm:w-auto">
              <FileText className="w-4 h-4 mr-2" />
              Visualizar PDF
            </Button>
            <Button onClick={handleDownloadPDF} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
          <CardTitle className="flex items-center">
            <Signature className="mr-2 text-primary" /> Assinatura Digital
          </CardTitle>
          <CardDescription>
            Leia atentamente os termos abaixo antes de assinar o documento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="p-4 border rounded-md bg-gray-50/50 max-h-60 overflow-y-auto">
            <p className="text-sm whitespace-pre-line">{TERMS_TEXT}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signature-name">Nome Completo:</Label>
              <Input
                id="signature-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                className="focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label>Assinatura Digital:</Label>
              <div className="border rounded-md bg-white p-2">
                <SignaturePad
                  ref={signaturePadRef}
                  canvasProps={{
                    className: 'signature-canvas w-full h-[200px] border rounded-md',
                    style: {
                      width: '100%',
                      height: '200px',
                      maxWidth: isMobile ? '100%' : '500px',
                      margin: '0 auto',
                    },
                  }}
                />
              </div>
              <Button variant="outline" size="sm" onClick={clearSignature} className="mt-2">
                <Pen className="w-4 h-4 mr-2" />
                Limpar Assinatura
              </Button>
            </div>

            <div className="flex items-start space-x-2 bg-secondary/50 p-3 rounded-md">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm font-medium leading-relaxed">
                Li e aceito os termos de uso apresentados acima. Entendo que esta assinatura digital
                possui o mesmo valor legal de uma assinatura física em papel.
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-6">
          <Button
            onClick={handleSign}
            disabled={!name || !acceptTerms || (signaturePadRef.current?.isEmpty() ?? true)}
            className="w-full"
          >
            <Signature className="w-4 h-4 mr-2" />
            Assinar Documento
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SignatureForm;
