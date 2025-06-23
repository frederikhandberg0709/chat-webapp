import { tokenStorage } from "@/lib/tokenStorage";
import { useCurrentUser } from "./useCurrentUser";

export const useAuth = () => {
  const { data: user, isPending, error, isError } = useCurrentUser();

  const hasToken = !!tokenStorage.getAccessToken();

  const isAuthenticated = !!user && !isError && hasToken;
  const isUnauthenticated = isError || !hasToken;

  return {
    user,
    isAuthenticated,
    isUnauthenticated,
    isPending,
    error,
  };
};
