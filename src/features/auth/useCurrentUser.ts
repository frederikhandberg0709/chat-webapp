import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { currentUser } from "./api";

export const useCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: ["useCurrentUser"],
    queryFn: currentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
