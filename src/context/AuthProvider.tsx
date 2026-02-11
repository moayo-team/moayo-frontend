import React, { createContext, useState, useEffect, useCallback } from "react";
import { apiClient } from "../api/client";
import type { GetProfileResult } from "../types/profile";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: GetProfileResult | null;
  isLoggedIn: boolean;
  authReady: boolean;
  setUser: (user: GetProfileResult | null) => void;
  setIsLoggedIn: (val: boolean) => void;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  completeLogin: (token: string) => Promise<void>;
}

export const logoutApi = async () => {
  return await apiClient.post("/api/v1/auth/logout");
};

export const refreshTokenApi = async () => {
  const { data } = await apiClient.post("/api/v1/auth/token/refresh");
  return data;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<GetProfileResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  const normalizeMerged = (usersMe: any, profilesMe: any): GetProfileResult => {
    const u = usersMe?.result ?? usersMe;
    const p = profilesMe?.result ?? profilesMe;

    const profileInfo = p?.profile;
    const userInfo = p?.user ?? u;

    return {
      user: {
        id: userInfo?.id ?? profileInfo?.userId ?? "",
        name: userInfo?.name ?? "",
        email: userInfo?.email ?? "",
        phoneNumber: userInfo?.phoneNumber ?? null,
      },
      profile: {
        id: profileInfo?.id ?? 0,
        imageUrl: profileInfo?.imageUrl ?? null,
        university: profileInfo?.university ?? null,
        major: profileInfo?.major ?? null,
        bio: profileInfo?.bio ?? null,
      },
      interestTags: profileInfo?.interestTags ?? [],
      indexItems: profileInfo?.indexItems ?? [],
      documents: profileInfo?.documents ?? [],
    } as GetProfileResult;
  };

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    try {
      const [usersRes, profilesRes] = await Promise.all([
        apiClient.get("/api/v1/users/me", headers ? { headers } : undefined),
        apiClient.get("/api/v1/profiles/me", headers ? { headers } : undefined),
      ]);

      const merged = normalizeMerged(usersRes.data, profilesRes.data);

      localStorage.setItem("user", JSON.stringify(merged));
      setUser(merged);
      setIsLoggedIn(true);
      localStorage.removeItem("loginSuccessModal");
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      throw error;
    }
  }, []);

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const urlAccessToken = searchParams.get("accessToken");

  //   if (!urlAccessToken) return;

  //   localStorage.setItem("accessToken", urlAccessToken);
  //   window.history.replaceState({}, document.title, window.location.pathname);

  //   (async () => {
  //     try {
  //       await refreshUser();
  //       localStorage.setItem("loginSuccessModal", "1");
  //     } catch {
  //       localStorage.removeItem("accessToken");
  //       localStorage.removeItem("user");
  //       setUser(null);
  //       setIsLoggedIn(false);
  //     }
  //   })();
  // }, [refreshUser]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");

      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser) as GetProfileResult;
          setUser(parsed);
          setIsLoggedIn(Boolean(token));
        } catch {
          localStorage.removeItem("user");
        }
      }

      if (token) {
        try {
          await refreshUser();
          return;
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          setUser(null);
          setIsLoggedIn(false);
        }
      }

      try {
        await refreshUser();
      } catch {
        // ignore
      }
    };

    initAuth().finally(() => {
      if (isMounted) setAuthReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(() => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/oauth/google`;
  }, []);

  const completeLogin = useCallback(
    async (token: string) => {
      localStorage.setItem("accessToken", token);
      window.history.replaceState({}, document.title, window.location.pathname);

      await refreshUser();
      localStorage.setItem("loginSuccessModal", "1");
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("loginSuccessModal");
      sessionStorage.removeItem("loginSuccessModalShown");
      setUser(null);
      setIsLoggedIn(false);
      queryClient.clear();
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        authReady,
        setUser,
        setIsLoggedIn,
        login,
        logout,
        refreshUser,
        completeLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
