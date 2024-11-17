import { FanToken } from "../lib/fantokendata";
import { useState } from 'react';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: FanToken;
}

const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, token }) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sanitizedBet, setSanitizedBet] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'confirm'>('input');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/create-bet-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description,
          tokenName: token.name 
        }),
      });

      if (!response.ok) throw new Error('Failed to process bet');
      
      const data = await response.json();
      console.log('Sanitized bet events:', data);
      setSanitizedBet(data.events);
      setStep('confirm');
    } catch (err) {
      setError('Failed to create bet. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    // Here you would implement the actual bet creation
    // For now, just close the modal
    onClose();
  };

  const handleBack = () => {
    setStep('input');
    setSanitizedBet(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-white">
          {step === 'input' ? `Create a Bet for ${token.name}` : 'Confirm Your Bet'}
        </h2>
        
        {step === 'input' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <div>
              <label htmlFor="betDescription" className="block text-sm font-medium text-gray-300 mb-1">
                What's your prediction?
              </label>
              <textarea
                id="betDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                rows={3}
                placeholder={`Example: ${token.name} will win their next match`}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Create Bet'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">
                Your original bet:
              </p>
              <p className="text-white bg-gray-800 rounded-lg p-3">
                {description}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">
                Sanitized bet description:
              </p>
              <p className="text-white bg-gray-800 rounded-lg p-3">
                {sanitizedBet}
              </p>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Confirm Bet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetModal; 