import Navbar from "./Navbar";
import PageContainer from "./PageContainer";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />

      <PageContainer>
        {children}
      </PageContainer>
    </div>
  );
}

export default AppLayout;