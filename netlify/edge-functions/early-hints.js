// Early Hints Edge Function for Netlify
// This helps with preloading critical resources

export default async function earlyHints(request, context) {
  // List of critical resources to preload
  const criticalResources = [
    { path: "/_next/static/css/1773a1dda5c4e148.css", as: "style" },
    { path: "/_next/static/chunks/main.js", as: "script" },
    { path: "/_next/static/chunks/pages/_app.js", as: "script" },
    { path: "/_next/static/chunks/webpack.js", as: "script" },
    { path: "/_next/static/chunks/framework.js", as: "script" },
  ];

  // Generating 103 Early Hints headers
  const earlyHintsHeaders = criticalResources.map(
    (resource) => `Link: <${resource.path}>; rel=preload; as=${resource.as}`
  );

  // Send early hints
  context.log(`Sending Early Hints for request: ${request.url}`);
  
  // Add preconnect hints for external resources
  earlyHintsHeaders.push('Link: <https://images.unsplash.com>; rel=preconnect');
  earlyHintsHeaders.push('Link: <https://fonts.googleapis.com>; rel=preconnect');
  earlyHintsHeaders.push('Link: <https://fonts.gstatic.com>; rel=preconnect; crossorigin');

  // Return response with proper HTTP 103 Early Hints
  context.sendEarlyHints({
    headers: { Link: earlyHintsHeaders.join(', ') },
  });
  
  // Pass through the request to the origin
  return context.next();
}