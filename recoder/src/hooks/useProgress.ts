"use client";

import { useEffect, useState } from "react";

export interface UserProgress {
    lastCompletedDate: string | null;
    currentStreak: number;
    completedChallenges: string[];
}

const STORAGE_KEY = "recoder_progress";

const defaultProgress: UserProgress = {
    lastCompletedDate: null,
    currentStreak: 0,
    completedChallenges: [],
};

export function useProgress() {
    const [progress, setProgress] = useState<UserProgress>(defaultProgress);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load from localStorage on mount
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProgress(JSON.parse(stored));
            }
        } catch (err) {
            console.error("Failed to load progress from localStorage", err);
        }
        setIsLoaded(true);
    }, []);

    const saveProgress = (newProgress: UserProgress) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
            setProgress(newProgress);
        } catch (err) {
            console.error("Failed to save progress to localStorage", err);
        }
    };

    const markChallengeCompleted = (challengeId: string) => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Check if streak continues
        let newStreak = progress.currentStreak;
        if (progress.lastCompletedDate) {
            const lastDate = new Date(progress.lastCompletedDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Continuous streak
                newStreak += 1;
            } else if (diffDays > 1) {
                // Streak broken
                newStreak = 1;
            }
            // If diffDays === 0, same day, no change
        } else {
            // First time completing
            newStreak = 1;
        }

        const newCompleted = progress.completedChallenges.includes(challengeId)
            ? progress.completedChallenges
            : [...progress.completedChallenges, challengeId];

        saveProgress({
            lastCompletedDate: today,
            currentStreak: newStreak,
            completedChallenges: newCompleted,
        });
    };

    // Check if today's challenge is completed
    const isTodayCompleted = () => {
        if (!progress.lastCompletedDate) return false;
        const today = new Date().toISOString().split("T")[0];
        return progress.lastCompletedDate === today;
    };

    return {
        progress,
        isLoaded,
        markChallengeCompleted,
        isTodayCompleted,
    };
}
