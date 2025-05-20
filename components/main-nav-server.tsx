import { getCurrentUser } from '@/lib/auth';
import { MainNav } from './main-nav';

export default async function MainNavServer() {
  const user = await getCurrentUser();
  return <MainNav user={user} />;
}
