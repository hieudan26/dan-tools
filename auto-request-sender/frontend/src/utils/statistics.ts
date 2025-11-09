import { Response, Statistics } from '../types';

export function calculateStatistics(
  responses: Response[]
): Statistics {
  if (responses.length === 0) {
    return {
      totalRequests: 0,
      successCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
      requestsPerSecond: 0,
      successRate: 0,
    };
  }

  const successResponses = responses.filter((r) => r.status >= 200 && r.status < 300);
  const errorResponses = responses.filter((r) => r.status >= 400 || r.error);

  const responseTimes = responses.map((r) => r.responseTime);
  const totalTime = responseTimes.reduce((sum, time) => sum + time, 0);
  const averageResponseTime = totalTime / responses.length;
  const minResponseTime = Math.min(...responseTimes);
  const maxResponseTime = Math.max(...responseTimes);

  const firstResponse = responses[0];
  const lastResponse = responses[responses.length - 1];
  const timeSpan = (lastResponse.timestamp - firstResponse.timestamp) / 1000;
  const requestsPerSecond = timeSpan > 0 ? responses.length / timeSpan : 0;

  const successRate = (successResponses.length / responses.length) * 100;

  return {
    totalRequests: responses.length,
    successCount: successResponses.length,
    errorCount: errorResponses.length,
    averageResponseTime: Math.round(averageResponseTime),
    minResponseTime,
    maxResponseTime,
    requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
    successRate: Math.round(successRate * 100) / 100,
    startTime: firstResponse.timestamp,
    endTime: lastResponse.timestamp,
  };
}

