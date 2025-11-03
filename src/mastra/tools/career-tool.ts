import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Only store the valid career paths - all responses come from Gemini
const VALID_CAREER_PATHS = ['ui-ux', 'frontend', 'backend', 'data-analysis'] as const;

const CAREER_PATH_INFO = {
  'ui-ux': 'UI/UX Design - User Interface and User Experience Design',
  'frontend': 'Frontend Development - Building user interfaces and client-side applications',
  'backend': 'Backend Development - Building server-side applications and APIs',
  'data-analysis': 'Data Analysis - Analyzing data to derive insights and support decisions'
};

export const careerTool = createTool({
  id: 'get-career-path-info',
  description: `Get information about a specific tech career path. This tool validates the career path and provides context to help generate personalized guidance. Valid paths: ${VALID_CAREER_PATHS.join(', ')}`,
  inputSchema: z.object({
    careerPath: z.enum(VALID_CAREER_PATHS).describe('The career path to get information about'),
    userContext: z.string().optional().describe('Additional context about the user (background, interests, goals)'),
    specificQuestion: z.string().optional().describe('Specific question the user asked')
  }),
  outputSchema: z.object({
    careerPath: z.string(),
    careerName: z.string(),
    isValid: z.boolean(),
    context: z.string(),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { careerPath, userContext, specificQuestion } = context;
    
    // Validate career path
    if (!VALID_CAREER_PATHS.includes(careerPath as any)) {
      return {
        careerPath,
        careerName: 'Unknown',
        isValid: false,
        context: '',
        message: `Invalid career path. I only provide guidance for: ${VALID_CAREER_PATHS.join(', ')}`
      };
    }

    const careerInfo = CAREER_PATH_INFO[careerPath];
    
    // Build context message for the agent
    let contextMessage = `The user is asking about ${careerInfo}.`;
    
    if (userContext) {
      contextMessage += ` User context: ${userContext}`;
    }
    
    if (specificQuestion) {
      contextMessage += ` Specific question: ${specificQuestion}`;
    }

    return {
      careerPath,
      careerName: careerInfo,
      isValid: true,
      context: contextMessage,
      message: `Valid career path: ${careerInfo}. The agent will now provide personalized guidance.`
    };
  },
});