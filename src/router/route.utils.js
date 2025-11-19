// Custom functions object - MUST remain empty
const customFunctions = {};

/**
 * Get route configuration for a given path
 */
export function getRouteConfig(path) {
  try {
    // Import routes.json dynamically
    const routes = require('./routes.json');
    
    // Find matching route configuration
    const matchingRoutes = Object.entries(routes)
      .filter(([pattern]) => matchesPattern(path, pattern))
      .sort(([a], [b]) => getSpecificity(b) - getSpecificity(a));

    return matchingRoutes.length > 0 ? matchingRoutes[0][1] : null;
  } catch (error) {
    console.error('Error loading route configuration:', error);
    return null;
  }
}

/**
 * Check if a path matches a route pattern
 */
export function matchesPattern(path, pattern) {
  // Exact match
  if (pattern === path) return true;
  
  // Parameter matching (:id)
  if (pattern.includes(':')) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    
    if (patternParts.length !== pathParts.length) return false;
    
    return patternParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  }
  
  // Wildcard matching
  if (pattern.endsWith('/**/*')) {
    const basePath = pattern.slice(0, -5); // Remove /**/*
    return path.startsWith(basePath);
  }
  
  if (pattern.endsWith('/*')) {
    const basePath = pattern.slice(0, -2); // Remove /*
    const remainingPath = path.slice(basePath.length);
    return path.startsWith(basePath) && !remainingPath.includes('/') || remainingPath === '';
  }
  
  return false;
}

/**
 * Get specificity score for route pattern (higher = more specific)
 */
export function getSpecificity(pattern) {
  let score = 0;
  
  // Exact paths get highest score
  if (!pattern.includes(':') && !pattern.includes('*')) {
    score += 1000;
  }
  
  // Parameters get medium score
  if (pattern.includes(':')) {
    score += 100;
  }
  
  // Wildcards get lowest score
  if (pattern.includes('*')) {
    score += 1;
  }
  
  // Longer paths get higher scores
  score += pattern.split('/').length;
  
  return score;
}

/**
 * Verify if user has access to a route
 */
export function verifyRouteAccess(config, user) {
  if (!config || !config.allow) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] };
  }

  const { when, redirectOnDeny, excludeRedirectQuery = false } = config.allow;
  const { conditions = [], operator = 'AND' } = when || {};

  const results = conditions.map(condition => {
    const { label, rule } = condition;
    
    switch (rule) {
      case 'public':
        return { passed: true, label };
      case 'authenticated':
        return { passed: !!user, label };
      default:
        console.warn(`Unknown rule: ${rule}`);
        return { passed: false, label: label || `Unknown rule: ${rule}` };
    }
  });

  let allowed;
  if (operator === 'OR') {
    allowed = results.some(r => r.passed);
  } else {
    allowed = results.every(r => r.passed);
  }

  const failed = results.filter(r => !r.passed).map(r => r.label);

  return {
    allowed,
    redirectTo: allowed ? null : (redirectOnDeny || '/login'),
    excludeRedirectQuery,
    failed
  };
}