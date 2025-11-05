import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { careerAgent } from './agents/career-agent';
import { a2aAgentRoute } from './agents/a2a-agent-route';


export const mastra = new Mastra({
  agents: { careerAgent },
  storage: new LibSQLStore({
    
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
   
    enabled: false, 
  },
  observability: {
    
    default: { enabled: true }, 
  },
  server: {
    build: {
      openAPIDocs: true,
      swaggerUI: true,
    },
    apiRoutes: [a2aAgentRoute]
  }
});