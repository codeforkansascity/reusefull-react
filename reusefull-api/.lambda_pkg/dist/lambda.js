import serverless from 'serverless-http';
import app from './app.js';
// AWS Lambda handler that serves the existing Express app.
// Bundle this file and deploy the output (dist/lambda.js) to Lambda.
export const handler = serverless(app);
//# sourceMappingURL=lambda.js.map