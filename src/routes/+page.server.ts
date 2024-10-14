// @ts-ignore
import type { Actions } from './$types';

export const actions: Actions = {
    predict: async ({ request }) => {
        try {
            const data = await request.json();
            
            const response = await fetch('http://127.0.0.1:5000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    strokes: data.strokes,
                })
            }).then(response => response.json());

            return {
                success: true,
                processedArray: response
            };
        } catch (error) {
            console.error('Error processing strokes:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }
};