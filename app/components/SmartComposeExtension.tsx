import { EditorView } from "@tiptap/pm/view";
import { Extension } from "@tiptap/react";
import { Plugin, PluginKey, Transaction } from '@tiptap/pm/state'
import debounce from 'lodash/debounce';

// Configurable options for the extension
interface SmartComposeOptions {
  enabled: boolean;
  // Minimum character count required before generating suggestions
  minChars: number;
  // Maximum words to generate in a suggestion
  maxWords: number;
  // Debounce delay in milliseconds
  debounceDelay: number;
}

export const SmartComposePluginKey = new PluginKey('smartCompose');

// LRU Cache for predictions
class PredictionCache {
  private cache: Map<string, string>;
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string): string | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to the end to mark as recently used
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: string, value: string): void {
    // If key exists, delete it first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // If cache is full, remove the oldest entry (first item in map)
    else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    // Add new entry
    this.cache.set(key, value);
  }
}

// Create a singleton cache instance
const predictionCache = new PredictionCache(50);

// Function to make a prediction based on the current context
const predictNextWords = async (context: string, maxWords: number = 5): Promise<string> => {
  try {
    // Check cache first
    const cacheKey = `${context}:${maxWords}`;
    const cachedPrediction = predictionCache.get(cacheKey);
    
    if (cachedPrediction !== undefined) {
      return '';
    }
    
    // If not in cache, call the API
    const response = await fetch('/api/ai/smartcompose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context,
        maxWords,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get prediction');
    }

    const data = await response.json();
    const suggestion = data.suggestion || '';
    
    // Cache the result
    predictionCache.set(cacheKey, suggestion);
    
    return suggestion;
  } catch (error) {
    console.error('Smart compose prediction error:', error);
    return '';
  }
};

export const SmartComposeExtension = Extension.create<SmartComposeOptions>({
  name: 'smartCompose',

  // Default options
  addOptions() {
    return {
      enabled: false,
      minChars: 10,
      maxWords: 8,
      debounceDelay: 1500,
    };
  },

  // Extension setup
  addStorage() {
    return {
      suggestion: '',
    };
  },

  // Plugin for integrating with ProseMirror
  addProseMirrorPlugins() {
    const { enabled, minChars, maxWords, debounceDelay } = this.options;
    const extension = this;

    // Create a debounced version of the prediction function
    const debouncedPredict = debounce(async (context: string, view: EditorView) => {
      // Only predict if enabled and enough context is available
      if (!extension.options.enabled) return;
      if (context.length < extension.options.minChars) return;
      
      // Get the prediction and store it
      const prediction = await predictNextWords(context, extension.options.maxWords);
      extension.storage.suggestion = prediction;
      
      // Notify the editor to update UI with the new suggestion
      if (prediction && view) {
        // Tell the editor something changed to trigger a rerender
        view.dispatch(view.state.tr.setMeta(SmartComposePluginKey, { 
          type: 'suggestion',
          suggestion: prediction
        }));
      }
    }, debounceDelay);

    return [
      new Plugin({
        key: SmartComposePluginKey,
        
        // Setup initial state
        state: {
          init() {
            return {
              suggestion: '',
              enabled,
            };
          },
          apply(tr: Transaction, prev: any) {
            // Handle meta updates from the prediction
            const meta = tr.getMeta(SmartComposePluginKey);
            
            if (meta?.type === 'suggestion') {
              return {
                ...prev,
                suggestion: meta.suggestion,
              };
            }
            
            // Clear suggestion if content changes
            if (tr.docChanged) {
              return {
                ...prev,
                suggestion: '',
              };
            }
            
            return prev;
          },
        },
        
        // Handle view updates
        view(view: EditorView) {
          return {
            update(view: EditorView, prevState: any) {
              // Only do work if extension is enabled
              if (!extension.options.enabled) return;
              
              // Get the current cursor position and document text
              const { state } = view;
              const { selection } = state;
              
              const isCursorSelection = selection.empty;
              if (!isCursorSelection) return;
              
              const context = view.state.doc.textBetween(Math.max(0, selection.anchor - 20), selection.anchor);
              debouncedPredict(context, view);
            },
            destroy() {
              // Clean up
              debouncedPredict.cancel();
            },
          };
        },
      }),
    ];
  },
});