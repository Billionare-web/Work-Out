import { auth } from "@/firebase/fire-config";
import FillMode from "@/pages/fill-mode";
import { useUserState } from "@/stores/user.store";
import { ReactNode, useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useUserState();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && setUser(user);
      setIsLoading(false);
    });
  }, []);
  return isLoading ? <FillMode /> : <>{children}</>;
};

export default AuthProvider;
