// @ts-ignore
import type { Actions } from './$types';
// @ts-ignore
import { score } from "../../lib/decision_tree_model";

type Point = [number, number];
type Stroke = Point[];
type Strokes = Stroke[];

function normalizeCoordinates(strokes: Strokes): Strokes {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    strokes.forEach(stroke => {
        stroke.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
    });

    const width = maxX - minX;
    const height = maxY - minY;
    const scale = Math.min(26 / width, 26 / height);

    return strokes.map(stroke =>
        stroke.map(([x, y]) => [
            Math.floor(1 + (x - minX) * scale),
            Math.floor(1 + (y - minY) * scale)
        ] as Point)
    );
}

function createBlankImage(): number[][] {
    return Array(28).fill(0).map(() => Array(28).fill(0));
}

function drawLine(
    image: number[][],
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    intensity: number = 1
) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
        if (x0 >= 0 && x0 < 28 && y0 >= 0 && y0 < 28) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newX = x0 + i;
                    const newY = y0 + j;
                    if (newX >= 0 && newX < 28 && newY >= 0 && newY < 28) {
                        const distance = Math.sqrt(i * i + j * j);
                        const pixelIntensity = intensity * Math.max(0, 1 - distance * 0.5);
                        image[newY][newX] = Math.min(1, image[newY][newX] + pixelIntensity);
                    }
                }
            }
        }

        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

function drawStrokes(strokes: Strokes): number[][] {
    const image = createBlankImage();
    const normalizedStrokes = normalizeCoordinates(strokes);

    normalizedStrokes.forEach(stroke => {
        for (let i = 1; i < stroke.length; i++) {
            const [x0, y0] = stroke[i - 1];
            const [x1, y1] = stroke[i];
            drawLine(image, x0, y0, x1, y1);
        }
    });

    return image;
}

function flattenImage(image: number[][]): number[] {
    return image.flat();
}

export const actions: Actions = {
    predict: async ({ request }) => {
        try {
            const data = await request.json();
            const strokes = data.strokes as Strokes;

            if (!Array.isArray(strokes)) {
                console.log(strokes);
                throw new Error('Invalid strokes data');
            }

            const imageArray = drawStrokes(strokes);

            const flattenedArray = flattenImage(imageArray);

            const prediction = score(flattenedArray);
            console.log(prediction)

            return {
                success: true,
                processedArray: prediction
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