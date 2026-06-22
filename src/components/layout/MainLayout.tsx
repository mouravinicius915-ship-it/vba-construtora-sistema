import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Sidebar />
      <main className="ml-64 mt-16 p-6">
        {children}
      </main>
    </div>
  );
}
