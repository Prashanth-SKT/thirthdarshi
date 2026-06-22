import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(); // Step 1: Create a context

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Step 2: Store user in state

  const login = (dummyCredentials) => {
    // Step 3: Fake login logic
    setUser({ name: 'Demo User', ...dummyCredentials });
  };

  const logout = () => {
    // Step 4: Clear user state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} {/* Step 5: Provide context to children */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Step 6: Custom hook to use auth
