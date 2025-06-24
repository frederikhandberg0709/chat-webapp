import { useLocalStorage } from "@/hooks/useLocalStorage";

export const useAuthTokens = () => {
  const [accessToken, setAccessToken, isHydrated] = useLocalStorage<
    string | null
  >("accessToken", null);
  const [refreshToken, setRefreshToken] = useLocalStorage<string | null>(
    "refreshToken",
    null,
  );

  const setTokens = (access: string, refresh: string) => {
    console.log("Setting tokens:", {
      access: `${access.substring(0, 20)}...`,
      refresh: `${refresh.substring(0, 20)}...`,
    });

    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
  };

  return {
    accessToken,
    refreshToken,
    setTokens,
    clearTokens,
    isHydrated,
  };
};
