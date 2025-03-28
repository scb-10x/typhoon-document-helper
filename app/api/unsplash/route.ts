import { NextRequest, NextResponse } from 'next/server';

// Sample response structure from Unsplash API
// This interface matches the structure of the Unsplash API response
// Used for reference in the commented-out implementation below
type UnsplashImage = {
    id: string;
    urls: {
        small: string;
        regular: string;
    };
    alt_description: string;
    user: {
        name: string;
    };
};

// Sample images for demo purposes
const sampleImages = [
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

// Additional nature-themed images
const natureImages = [
    {
        id: 'nature-1',
        urls: {
            small: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'Mountain lake with reflection',
        user: { name: 'Nature Photographer' }
    },
    {
        id: 'nature-2',
        urls: {
            small: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'Green valley with mountains',
        user: { name: 'Valley Explorer' }
    }
];

// City-themed images
const cityImages = [
    {
        id: 'city-1',
        urls: {
            small: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'City skyline at night',
        user: { name: 'Urban Photographer' }
    },
    {
        id: 'city-2',
        urls: {
            small: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            regular: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        },
        alt_description: 'New York skyline with Empire State Building',
        user: { name: 'City Explorer' }
    }
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json(
            { error: 'Search query is required' },
            { status: 400 }
        );
    }

    try {
        // In a real implementation, you would use the Unsplash API with your API key
        // const accessKey = process.env.UNSPLASH_ACCESS_KEY;
        // const response = await fetch(
        //     `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20`,
        //     {
        //         headers: {
        //             Authorization: `Client-ID ${accessKey}`
        //         }
        //     }
        // );
        // const data = await response.json();

        // For demonstration purposes, return mock data based on search query
        let results;

        if (query.toLowerCase().includes('nature') || query.toLowerCase().includes('mountain') || query.toLowerCase().includes('landscape')) {
            results = [...natureImages, ...sampleImages.slice(0, 4)];
        } else if (query.toLowerCase().includes('city') || query.toLowerCase().includes('urban') || query.toLowerCase().includes('building')) {
            results = [...cityImages, ...sampleImages.slice(2, 6)];
        } else {
            // Randomize the order of sample images
            results = [...sampleImages].sort(() => Math.random() - 0.5);
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Unsplash API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch images from Unsplash' },
            { status: 500 }
        );
    }
} 