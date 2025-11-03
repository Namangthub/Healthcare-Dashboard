import express from 'express';
import app from '../app.js';

// Function to extract routes from an Express app
export function getRoutes(app) {
  const routes = [];

  function extractRoutes(layer, path = '') {
    if (layer.route) {
      const route = layer.route;
      const fullPath = path + route.path;

      // Get HTTP methods for this route
      const methods = Object.keys(route.methods)
        .filter(method => route.methods[method])
        .map(method => method.toUpperCase());

      // Add to routes array
      routes.push({
        path: fullPath,
        methods: methods.length ? methods : ['GET']
      });
    } else if (layer.name === 'router' && layer.handle.stack) {
      // It's a router middleware
      const routerPath =
        path + (layer.regexp.toString().match(/^\/\^\\\/([^\\]*)/)?.[1] || '');
      layer.handle.stack.forEach(innerLayer =>
        extractRoutes(innerLayer, routerPath)
      );
    } else if (
      layer.name !== 'expressInit' &&
      layer.name !== 'query' &&
      layer.name !== 'corsMiddleware' &&
      layer.name !== 'jsonParser' &&
      layer.name !== 'errorHandler' &&
      layer.handle
    ) {
      if (layer.regexp && layer.regexp.fast_slash !== true) {
        const subPath =
          layer.regexp.toString().match(/^\/\^\\\/([^\\]*)/)?.[1] || '';
        const routerPath = path + (subPath ? `/${subPath}` : '');

        // Check if it has a route stack
        if (layer.handle.stack) {
          layer.handle.stack.forEach(subLayer =>
            extractRoutes(subLayer, routerPath)
          );
        }
      }
    }
  }

  // Start extracting routes from middleware stack
  if (app._router && app._router.stack) {
    app._router.stack.forEach(layer => extractRoutes(layer));
  }

  return routes;
}

// Get and display routes
export function displayRoutes() {
  try {
    const routes = getRoutes(app);

    console.log('=== Available API Routes ===');

    // Group by base path
    const groupedRoutes = {};
    routes.forEach(route => {
      const basePath = route.path.split('/')[1] || '/';
      if (!groupedRoutes[basePath]) {
        groupedRoutes[basePath] = [];
      }
      groupedRoutes[basePath].push(route);
    });

    // Display routes by group
    Object.keys(groupedRoutes)
      .sort()
      .forEach(basePath => {
        console.log(`\n${basePath.toUpperCase()}:`);

        groupedRoutes[basePath]
          .sort((a, b) => a.path.localeCompare(b.path))
          .forEach(route => {
            console.log(`  ${route.methods.join(', ')} ${route.path}`);
          });
      });

    console.log('\nTotal API routes:', routes.length);
  } catch (error) {
    console.error('Error displaying routes:', error);
  }
}

// ✅ Run directly if called from command line
if (import.meta.url === `file://${process.argv[1]}`) {
  displayRoutes();
}

export default {
  displayRoutes,
  getRoutes
};
