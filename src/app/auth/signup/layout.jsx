import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/oauth';

export default async function SignupLayout({ children }) {
  // Check authentication on the server side
  const user = await getAuthUser();
  
  if (user) {
    // User is authenticated, redirect to appropriate dashboard
    const dashboardUrl = user.role === 'admin' ? '/admin' : 
                        user.role === 'player' ? '/player-profile' : 
                        '/profile';
    redirect(dashboardUrl);
  }

  // User is not authenticated, show the signup page
  return children;
}
