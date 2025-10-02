import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface GenerateComparisonImageParams {
    student1Name: string;
    student2Name: string;
    adjective: string;
    base64ImageData1: string;
    base64ImageData2: string;
}

/**
 * Generates a comparison image based on a prompt and two images.
 * @param params The parameters for image generation.
 * @returns A promise that resolves to the generated image URL (data URL).
 */
export async function generateComparisonImage({
    student1Name,
    student2Name,
    adjective,
    base64ImageData1,
    base64ImageData2,
}: GenerateComparisonImageParams): Promise<string> {
    try {
        const prompt = `ABSOLUTELY CRUCIAL INSTRUCTION: Your primary task is to use the real, unmodified faces from the two photos provided. Do NOT alter, redraw, or caricature the faces. Cut out the heads/faces precisely and place them onto new, fun, cartoon-style bodies. Create an exaggerated cartoon image for young children that compares ${student1Name} and ${student2Name}. The image must visually show that ${student1Name} is more ${adjective} than ${student2Name}. Do not write the adjective on the image. The names '${student1Name}' and '${student2Name}' must be written clearly at the bottom of the image.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    { text: `This photo is of ${student1Name}.` },
                    { inlineData: { mimeType: "image/jpeg", data: base64ImageData1 } },
                    { text: `This photo is of ${student2Name}.` },
                    { inlineData: { mimeType: "image/jpeg", data: base64ImageData2 } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            throw new Error('Request blocked for safety reasons. Please try different images or prompt.');
        }

        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart && imagePart.inlineData) {
            return `data:image/png;base64,${imagePart.inlineData.data}`;
        }
        
        throw new Error('Model did not return an image.');
    } catch (error) {
        console.error("Error generating comparison image:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to generate the magic image.");
    }
}