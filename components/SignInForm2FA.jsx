'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { check2FACode, send2FACode } from '@/lib/auth';
import FormContainer from './form/FormContainer';
import { LoginButton } from './ui/login-button';

export default function SigninForm2FA() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']); // Array para armazenar os 4 dígitos
  const [step, setStep] = useState(1); // Step 1: Email input, Step 2: Code validation
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef([]);

  const handleEmailSubmit = async (formdata) => {
    setIsLoading(true);
    setError(null);
    const email = formdata.get('email');
    if(!email) {
      setError('Por favor, insira um email válido.');
      setIsLoading(false);
      return;
    }
    setEmail(email);
    try {
      const validationResponse = await send2FACode(email);
      if (!validationResponse.success) {
        throw new Error(validationResponse.error);
      }
      setIsLoading(false);
      setStep(2); // Avançar para validação do código
    } catch (err) {
      setError('Erro ao verificar usuário.');
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await check2FACode(email, code.join('')); // Junta os dígitos em uma string

      if (!response.success) {
        setError('Código inválido.');
        return;
      }

      // Redirecionar para o dashboard
      router.push('/');
    } catch (err) {
      setError('Erro ao validar código.');
    }
  };

  const handleInputChange = (index, value) => {
    if (!/^\d$/.test(value) && value !== '') return; // Permite apenas números
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move para o próximo campo automaticamente
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {step === 1 && (
        <FormContainer formAction={handleEmailSubmit}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold uppercase text-black">Login</h1>
          </div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="bg-white block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              placeholder="john.doe@email.com"
            />
          </label>
          <LoginButton size='large' variant='default'>{isLoading ? 'Enviando...' : 'Enviar Código'}</LoginButton>
            {error && <p className="text-red-500">{error}</p>}
        </FormContainer>
      )}

      {step === 2 && (
        <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            {code.map((digit, index) => (
              <input
              
                key={index}
                type="tel"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="border p-2 rounded text-2xl text-center w-12 text-white"
                maxLength={1}
                required
              />
            ))}
          </div>
          <LoginButton size='large' variant='default'>Validar Código</LoginButton>
        </form>
      )}
    </div>
  );
}