import { FanToken } from "../lib/fantokendata";

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: FanToken;
}

const BetModal: React.FC<BetModalProps> = ({ isOpen, onClose, token }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement bet creation logic
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-white">Create a Bet for {token.name}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="betDescription" className="block text-sm font-medium text-gray-300 mb-1">
              What's your prediction?
            </label>
            <textarea
              id="betDescription"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              rows={3}
              placeholder={`Example: ${token.name} will win their next match`}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
            >
              Create Bet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BetModal; 