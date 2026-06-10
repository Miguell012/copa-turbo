import Header from "./Header";
import Footer from "./Footer";

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function AppShell({
  children,
  showHeader = true,
  showFooter = true,
}: AppShellProps) {
  return (
    <>
      {showHeader && <Header />}
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}
