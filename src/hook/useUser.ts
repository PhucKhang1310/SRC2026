import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type UserContextValue = {
  user: string | null;
  login: (token: string) => void;
};

const userTokenStorageKey = "resfes-user-token";

const UserContext = React.createContext<UserContextValue | undefined>(
  undefined,
);

const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<string | null>(() =>
    window.sessionStorage.getItem(userTokenStorageKey),
  );

  const login = useCallback((token: string) => {
    window.sessionStorage.setItem(userTokenStorageKey, token);
    setUser(token);
  }, []);

  const contextValue = useMemo(() => ({ user, login }), [user, login]);

  return React.createElement(UserContext.Provider, {
    value: contextValue,
    children,
  });
};

const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export { UserProvider, useUser };
