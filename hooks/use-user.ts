"use client"

import { useState, useCallback } from "react"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface UserState {
  user: User | null
  favorites: number[]
  watchHistory: Array<{ id: number; title: string; progress: number }>
  downloads: number[]
  isLoggedIn: boolean
}

export const useUser = () => {
  const [userState, setUserState] = useState<UserState>({
    user: null,
    favorites: [],
    watchHistory: [],
    downloads: [],
    isLoggedIn: false,
  })

  const login = useCallback((email: string, password: string) => {
    setUserState((prev) => ({
      ...prev,
      user: { id: "1", email, name: email.split("@")[0] },
      isLoggedIn: true,
    }))
  }, [])

  const signup = useCallback((email: string, name: string, password: string) => {
    setUserState((prev) => ({
      ...prev,
      user: { id: "1", email, name },
      isLoggedIn: true,
    }))
  }, [])

  const logout = useCallback(() => {
    setUserState({
      user: null,
      favorites: [],
      watchHistory: [],
      downloads: [],
      isLoggedIn: false,
    })
  }, [])

  const addFavorite = useCallback((movieId: number) => {
    setUserState((prev) => ({
      ...prev,
      favorites: [...new Set([...prev.favorites, movieId])],
    }))
  }, [])

  const removeFavorite = useCallback((movieId: number) => {
    setUserState((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((id) => id !== movieId),
    }))
  }, [])

  const addToWatchHistory = useCallback((movieId: number, title: string) => {
    setUserState((prev) => {
      const existing = prev.watchHistory.find((item) => item.id === movieId)
      if (existing) {
        return {
          ...prev,
          watchHistory: prev.watchHistory.map((item) => (item.id === movieId ? { ...item, progress: 50 } : item)),
        }
      }
      return {
        ...prev,
        watchHistory: [...prev.watchHistory, { id: movieId, title, progress: 50 }],
      }
    })
  }, [])

  const addDownload = useCallback((movieId: number) => {
    setUserState((prev) => ({
      ...prev,
      downloads: [...new Set([...prev.downloads, movieId])],
    }))
  }, [])

  const removeDownload = useCallback((movieId: number) => {
    setUserState((prev) => ({
      ...prev,
      downloads: prev.downloads.filter((id) => id !== movieId),
    }))
  }, [])

  return {
    ...userState,
    login,
    signup,
    logout,
    addFavorite,
    removeFavorite,
    addToWatchHistory,
    addDownload,
    removeDownload,
  }
}
