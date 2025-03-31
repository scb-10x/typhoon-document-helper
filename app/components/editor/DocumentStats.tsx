'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';

const calculateDocumentStats = (content: string) => {
    // Remove HTML tags for accurate counting
    const textOnly = content.replace(/<[^>]*>/g, ' ');

    // Calculate words by splitting on whitespace
    const words = textOnly.trim().split(/\s+/).filter(Boolean).length;

    // Calculate characters (including spaces)
    const characters = textOnly.length;

    // Calculate characters (excluding spaces)
    const charactersNoSpaces = textOnly.replace(/\s+/g, '').length;

    return {
        words,
        characters,
        charactersNoSpaces
    };
};

interface DocumentStatsProps {
    editor: Editor | null;
}

const DocumentStats = ({ editor }: DocumentStatsProps) => {
    const [stats, setStats] = useState({
        words: 0,
        characters: 0,
        charactersNoSpaces: 0
    });

    // Use a ref to track the current stats without causing re-renders
    const statsRef = useRef(stats);

    // Track if component is mounted to prevent memory leaks
    const isMounted = useRef(true);

    // Update the ref when state changes
    useEffect(() => {
        statsRef.current = stats;
    }, [stats]);

    // Set up the mount/unmount tracking
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Memoized updateStats that uses the ref instead of the state in its dependencies
    const updateStats = useCallback(() => {
        if (!editor || !isMounted.current) return;

        const content = editor.getHTML();
        const newStats = calculateDocumentStats(content);

        // Compare with the ref value, not the state
        const currentStats = statsRef.current;
        if (newStats.words !== currentStats.words ||
            newStats.characters !== currentStats.characters ||
            newStats.charactersNoSpaces !== currentStats.charactersNoSpaces) {
            // Only update state if component is still mounted
            if (isMounted.current) {
                setStats(newStats);
            }
        }
    }, [editor]); // Only depend on editor, not on stats

    useEffect(() => {
        if (!editor) return;

        // Initialize stats once
        updateStats();

        // Use a variable to store the timeout ID
        let timeoutId: ReturnType<typeof setTimeout>;

        // Debounced update handler to prevent too frequent updates
        const handleUpdate = () => {
            // Clear any pending updates
            clearTimeout(timeoutId);
            // Schedule update after a short delay
            timeoutId = setTimeout(updateStats, 300);
        };

        // Update stats on content change with debounce
        editor.on('update', handleUpdate);

        return () => {
            clearTimeout(timeoutId);
            editor.off('update', handleUpdate);
        };
    }, [editor, updateStats]);

    return (
        <div className="text-xs flex items-center gap-3 text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
            <div>
                <span className="font-medium">{stats.words}</span> words
            </div>
            <div>
                <span className="font-medium">{stats.characters}</span> characters
            </div>
            <div>
                <span className="font-medium">{stats.charactersNoSpaces}</span> characters (no spaces)
            </div>
        </div>
    );
};

export default DocumentStats; 