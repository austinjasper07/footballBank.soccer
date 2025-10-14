export default function SignupLayout({ children }) {
  // Let the client-side handle authentication checks to avoid redirect loops
  // The signup page will handle redirects after successful authentication
  return children;
}

