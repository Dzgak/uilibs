import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // Load favorites from localStorage on mount
    const savedFavorites = localStorage.getItem('libraryFavorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const toggleFavorite = (libraryId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(libraryId)
        ? prev.filter(id => id !== libraryId)
        : [...prev, libraryId]
      
      // Save to localStorage
      localStorage.setItem('libraryFavorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (libraryId: string) => favorites.includes(libraryId)

  return {
    favorites,
    toggleFavorite,
    isFavorite
  }
} 