
// auth check for server component
const {IsAuthenticated } = getKindeServerSession();
if (!(await IsAuthenticated())) {
    redirect(('/api/auth/login'))
}


// middleware

import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware'
import { redirect } from 'next/navigation'

export default async function middleware(req) {
    return withAuth(req)
}

// for client use "useKindeBrowerClient()"

 const {IsAuthenticated, getUser} = useKindeBrowserClient();
  const user = getUser();

