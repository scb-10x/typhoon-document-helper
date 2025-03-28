import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Image as LucideImage, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface UnsplashImage {
    id: string;
    urls: {
        small: string;
        regular: string;
    };
    alt_description: string;
    user: {
        name: string;
    };
}

interface UnsplashImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInsertImage: (imageUrl: string, altText: string) => void;
}

const UnsplashImageModal: React.FC<UnsplashImageModalProps> = ({ isOpen, onClose, onInsertImage }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [images, setImages] = useState<UnsplashImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Focus search input when modal opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!searchQuery.trim()) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // In a real app, you'd use an actual Unsplash API key
            // For demo purposes, we're using a mock API call
            const response = await fetch(`/api/unsplash?query=${encodeURIComponent(searchQuery)}`);

            if (!response.ok) {
                throw new Error('Failed to fetch images');
            }

            const data = await response.json();
            setImages(data.results || []);
        } catch (err) {
            console.error('Error fetching images:', err);
            setError('Failed to fetch images. Please try again.');

            // For demo purposes, load some sample images if API fails
            setImages(sampleImages);
        } finally {
            setLoading(false);
        }
    };

    // Handle image selection
    const handleImageSelect = (image: UnsplashImage) => {
        onInsertImage(
            image.urls.regular,
            image.alt_description || `Image by ${image.user.name} from Unsplash`
        );
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full h-[600px] max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <LucideImage className="w-5 h-5 mr-2 text-purple-600" aria-hidden="true" />
                        Insert Unsplash Image
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-200">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for images..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
                        </button>
                    </form>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>

                <div className="flex-grow overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                        </div>
                    ) : images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    onClick={() => handleImageSelect(image)}
                                    className="group cursor-pointer relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-all"
                                >
                                    <Image
                                        src={image.urls.small}
                                        alt={image.alt_description || "Unsplash image"}
                                        width={300}
                                        height={160}
                                        className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-20 transition-opacity">
                                        <span className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                                            Select
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs truncate">
                                        Photo by {image.user.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <LucideImage className="w-12 h-12 mb-2 opacity-30" aria-hidden="true" />
                            <p>Search for images to display results</p>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 p-4 text-xs text-gray-500 text-center">
                    Images powered by Unsplash. By using this feature, you agree to follow the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Unsplash License</a>.
                </div>
            </div>
        </div>
    );
};

// Sample images for demo purposes if API is not available
const sampleImages: UnsplashImage[] = [
    {
        id: 'sample-1',
        urls: {
            small: 'https://images.unsplash.com/photo-1547483238-2cbf881a559f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1547483238-2cbf881a559f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'Mountain landscape with clouds',
        user: { name: 'John Doe' }
    },
    {
        id: 'sample-2',
        urls: {
            small: 'https://images.unsplash.com/photo-1631116617822-e100bd7e6e06?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1631116617822-e100bd7e6e06?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'Ocean sunset with waves',
        user: { name: 'Jane Smith' }
    },
    {
        id: 'sample-3',
        urls: {
            small: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'Sunset through forest trees',
        user: { name: 'Alex Johnson' }
    },
    {
        id: 'sample-4',
        urls: {
            small: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'Snowy mountain peak',
        user: { name: 'Sam Wilson' }
    },
    {
        id: 'sample-5',
        urls: {
            small: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'Lake with mountains in background',
        user: { name: 'Emma Davis' }
    },
    {
        id: 'sample-6',
        urls: {
            small: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1551009175-8a68da93d5f9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'Colorful city buildings',
        user: { name: 'Michael Brown' }
    }
];

export default UnsplashImageModal; 