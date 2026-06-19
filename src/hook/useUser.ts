import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { getCurrentUser, type CurrentUser } from "../api/authApi";

type UserContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (user: CurrentUser) => void;
};

const UserContext = React.createContext<UserContextValue | undefined>(
  undefined,
);

const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.sessionStorage.removeItem("resfes-user-token");

    const controller = new AbortController();

    getCurrentUser(controller.signal)
      .then(setUser)
      .catch((error: Error) => {
        if (error.name !== "AbortError") {
          setUser(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const login = useCallback((user: CurrentUser) => {
    setUser(user);
  }, []);

  const contextValue = useMemo(
    () => ({ user, isLoading, login }),
    [user, isLoading, login],
  );

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
