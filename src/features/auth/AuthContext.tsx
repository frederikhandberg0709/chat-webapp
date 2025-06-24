"use client";

import api from "@/lib/axios";
import { User } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthTokens } from "./useAuthTokens";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  isTokenAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCurrentUser = async (): Promise<User> => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { accessToken, refreshToken, setTokens, clearTokens, isHydrated } =
    useAuthTokens();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldFetchUser = isMounted && isHydrated && !!accessToken;

  const {
    data: user,
    isLoading: isUserLoading,
    error,
    isError,
  } = useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: shouldFetchUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!isHydrated) return;

    const requestInterceptor = api.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;

          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
              {
                refreshToken,
              }
            );

            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = response.data;
            setTokens(newAccessToken, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            console.log("Token refresh failed:", refreshError);

            clearTokens();
            queryClient.removeQueries({ queryKey: ["currentUser"] });
            router.push("/login");
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [
    accessToken,
    refreshToken,
    isHydrated,
    setTokens,
    clearTokens,
    queryClient,
    router,
  ]);

  const login = (accessToken: string, refreshToken: string, user: User) => {
    setTokens(accessToken, refreshToken);
    queryClient.setQueryData(["currentUser"], user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      clearTokens();
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      router.push("/login");
    }
  };

  const isAuthenticated = isHydrated && !!user && !!accessToken && !isError;
  const isUnauthenticated = isHydrated && (!accessToken || isError);
  const isTokenAuthenticated = isHydrated && !!accessToken && !isError;
  const isLoading =
    !isMounted || !isHydrated || (shouldFetchUser && isUserLoading);

  if (!isMounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated,
        isUnauthenticated,
        isTokenAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
