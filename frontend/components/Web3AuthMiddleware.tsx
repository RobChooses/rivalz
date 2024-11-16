import { Web3AuthProvider } from '../context/Web3AuthContext';

const Web3AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  return <Web3AuthProvider>{children}</Web3AuthProvider>;
};

export default Web3AuthMiddleware;
