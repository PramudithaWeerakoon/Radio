// Early Hints Edge Function for Netlify
// This helps with preloading critical resources

export default async function onRequest(context) {
  try {
    // List of critical resources to preload
    const criticalResources = [
      { path: "/_next/static/css/1773a1dda5c4e148.css", as: "style" },
      { path: "/_next/static/chunks/main.js", as: "script" },
      { path: "/_next/static/chunks/pages/_app.js", as: "script" },
      { path: "/_next/static/chunks/webpack.js", as: "script" },
      { path: "/_next/static/chunks/framework.js", as: "script" },
    ];

    // Generate Link headers for preloading
    const linkHeaders = criticalResources.map(
      (resource) => `<${resource.path}>; rel=preload; as=${resource.as}`
    );
    
    // Add preconnect hints for external resources
    linkHeaders.push('<https://images.unsplash.com>; rel=preconnect');
    linkHeaders.push('<https://fonts.googleapis.com>; rel=preconnect');
    linkHeaders.push('<https://fonts.gstatic.com>; rel=preconnect; crossorigin');

    // Get the response from the origin
    const response = await context.next();
    
    // Add the Link header to the response
    response.headers.set('Link', linkHeaders.join(', '));
    
    // Return the modified response
    return response;
  } catch (error) {
    console.error('Edge function error:', error);
    return context.next();
  }
}