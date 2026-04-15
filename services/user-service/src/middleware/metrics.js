const client = require('prom-client');

function createPrometheusMetrics() {
  // Create a Registry to register the metrics
  const register = new client.Registry();

  // Add default metrics
  client.collectDefaultMetrics({ register });

  // Custom metrics
  const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
  });

  const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
  });

  const activeConnections = new client.Gauge({
    name: 'active_connections',
    help: 'Number of active connections'
  });

  // Register custom metrics
  register.registerMetric(httpRequestDuration);
  register.registerMetric(httpRequestsTotal);
  register.registerMetric(activeConnections);

  return {
    register,
    httpRequestDuration,
    httpRequestsTotal,
    activeConnections
  };
}

module.exports = { createPrometheusMetrics };