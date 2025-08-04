'use client';

import { KindeProvider } from '@kinde-oss/kinde-auth-nextjs';

export function KindeClientProvider({ children }) {
  return (
    <KindeProvider
      clientId={process.env.NEXT_PUBLIC_KINDE_CLIENT_ID}
      domain={process.env.NEXT_PUBLIC_KINDE_ISSUER_URL}
      redirectUri={process.env.NEXT_PUBLIC_KINDE_REDIRECT_URI}
      logoutRedirectUri={process.env.NEXT_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URI}
    >
      {children}
    </KindeProvider>
  );
}
