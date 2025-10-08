export default function LoginLayout({ children }) {
  // Let the client-side handle authentication checks to avoid redirect loops
  // The login page will handle redirects after successful authentication
  return children;
}

