import { toast } from 'react-hot-toast';

export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public status: number = 500,
        public isUserFriendly: boolean = true
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (error: unknown, t: (key: string) => string) => {
    console.error('Error:', error);

    if (error instanceof AppError) {
        if (error.isUserFriendly) {
            toast.error(t(error.code) || error.message);
        }
        return error;
    }

    if (error instanceof Error) {
        toast.error(t('genericError') || error.message);
        return new AppError(error.message, 'genericError');
    }

    const message = typeof error === 'string' ? error : 'An unknown error occurred';
    toast.error(t('genericError') || message);
    return new AppError(message, 'genericError');
};

export const handleApiError = async (response: Response, t: (key: string) => string) => {
    if (!response.ok) {
        let errorMessage = t('apiError');
        try {
            const data = await response.json();
            errorMessage = data.message || errorMessage;
        } catch {
            // If we can't parse the error response, use the default message
        }

        throw new AppError(
            errorMessage,
            `apiError${response.status}`,
            response.status,
            true
        );
    }

    return response;
};

export const handleExportError = (error: unknown, t: (key: string) => string) => {
    console.error('Export error:', error);
    toast.error(t('exportError'));
    return false;
};

export const handleAIServiceError = (error: unknown, t: (key: string) => string) => {
    console.error('AI service error:', error);
    toast.error(t('aiServiceError'));
    return null;
};

export const handleImageError = (error: unknown, t: (key: string) => string) => {
    console.error('Image error:', error);
    toast.error(t('imageError'));
    return null;
};

export const handlePDFError = (error: unknown, t: (key: string) => string) => {
    console.error('PDF generation error:', error);
    toast.error(t('pdfError'));
    return false;
}; 