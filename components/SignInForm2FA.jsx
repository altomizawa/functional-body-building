'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { check2FACode, isUserinDB } from '@/lib/auth';
import { send2FACode } from '@/lib/auth';
import FormContainer from './form/FormContainer';

export default function SigninForm2FA() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // Step 1: Email input, Step 2: Code validation
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleEmailSubmit = async (formdata) => {
    setError(null);
    const email = formdata.get('email');
    setEmail(email);
    try {
      // Gerar e enviar código de validação
      const validationResponse = await send2FACode(email);
      if (!validationResponse.success) {
        throw new Error(validationResponse.error);
      }

      setStep(2); // Avançar para validação do código
    } catch (err) {
      setError('Erro ao verificar usuário.');
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await check2FACode(email, code);

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

  return (
    <div className="flex flex-col items-center">
      {step === 1 && (
        <FormContainer formAction={handleEmailSubmit}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold uppercase">Login</h1>
          </div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          Email
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              placeholder="john.doe@email.com"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full border-2 py-2 rounded-md bg-black text-white hover:bg-gray-500"
          >
            Enviar Código
          </button>
        </FormContainer>
      )}

      {step === 2 && (
        <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Digite o código recebido"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Validar código
          </button>
        </form>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}