import React, { useState } from 'react';
import LoadingButton from './LoadingButton';
import Modal from './Modal';
import Input from './Input';

export default function ComponentDemo() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    if (value.length < 3) {
      setInputError('Must be at least 3 characters');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-8">Component Library Demo</h1>

      {/* LoadingButton Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">LoadingButton</h2>
        <div className="flex gap-4 flex-wrap">
          <LoadingButton
            loading={loading}
            onClick={handleLoadingClick}
            variant="primary"
          >
            Primary Button
          </LoadingButton>
          
          <LoadingButton
            loading={loading}
            onClick={handleLoadingClick}
            variant="secondary"
          >
            Secondary Button
          </LoadingButton>
          
          <LoadingButton
            loading={loading}
            onClick={handleLoadingClick}
            variant="danger"
          >
            Danger Button
          </LoadingButton>
          
          <LoadingButton disabled>
            Disabled Button
          </LoadingButton>
        </div>
      </section>

      {/* Modal Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Modal</h2>
        <LoadingButton onClick={() => setIsModalOpen(true)}>
          Open Modal
        </LoadingButton>
        
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Demo Modal"
        >
          <p className="text-gray-700 mb-4">
            This is a modal with portal rendering, overlay, animations, and accessibility features.
          </p>
          <div className="flex gap-2 justify-end">
            <LoadingButton
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </LoadingButton>
            <LoadingButton onClick={() => setIsModalOpen(false)}>
              Confirm
            </LoadingButton>
          </div>
        </Modal>
      </section>

      {/* Input Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input</h2>
        <div className="space-y-4 max-w-md">
          <Input
            label="Username"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter username"
            error={inputError}
            required
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            disabled
          />
        </div>
      </section>
    </div>
  );
}
