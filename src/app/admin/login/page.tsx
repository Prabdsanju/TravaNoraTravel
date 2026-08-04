import { checkSetupRequired } from '@/app/actions/auth';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Admin Login - TravaNora',
};

export default async function AdminLoginPage() {
  const isSetupRequired = await checkSetupRequired();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoginForm isSetupRequired={isSetupRequired} />
    </div>
  );
}
