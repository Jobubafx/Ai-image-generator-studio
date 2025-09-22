
import { GoogleGenAI, Modality, GenerateContentResponse, Type } from "@google/genai";
import { SourceImage } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateImageModification = async (
  sourceImage: SourceImage,
  prompt: string
): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: sourceImage.base64,
              mimeType: sourceImage.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error('No image was generated in the response.');
  } catch (error) {
    console.error('Error generating image modification:', error);
    throw new Error('Failed to generate the image. Please check the console for more details.');
  }
};

export const generateCreativeConcepts = async (
  basePrompt: string
): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following idea, generate 3 unique and detailed creative prompts for an AI image generator. Each prompt should be over 300 characters. Idea: "${basePrompt}"`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  prompts: {
                    type: Type.ARRAY,
                    description: "An array of 3 creative prompts.",
                    items: {
                      type: Type.STRING
                    }
                  }
                }
              },
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result.prompts || [];

    } catch (error) {
        console.error('Error generating creative concepts:', error);
        throw new Error('Failed to generate creative concepts.');
    }
};
