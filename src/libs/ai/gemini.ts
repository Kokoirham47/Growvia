import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''

export const genAI = new GoogleGenerativeAI(apiKey)

/**
 * Helper to get a configured Gemini generative model
 * @param modelName Default is 'gemini-1.5-flash' for speed and cost efficiency
 */
export function getGeminiModel(modelName = 'gemini-1.5-flash') {
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not configured in .env.local')
  }

  return genAI.getGenerativeModel({ model: modelName })
}
