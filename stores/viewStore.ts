'use client'

import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

export type ViewMode = 'grid' | 'compact'

interface ViewState {
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
}

export const useViewStore = create<ViewState>()(
    subscribeWithSelector(
        persist(
            (set) => ({
                viewMode: 'grid',
                setViewMode: (mode: ViewMode) => set({ viewMode: mode }),
            }),
            {
                name: 'movie-list-view-storage',
                partialize: (state) => ({ viewMode: state.viewMode }),
            }
        )
    )
)

// Shallow comparison selector for performance
export const useViewMode = () => useViewStore((state) => state.viewMode)
