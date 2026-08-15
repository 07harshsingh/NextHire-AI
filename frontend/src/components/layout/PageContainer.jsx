function PageContainer({ children, className = "" }) {
  return (
    <main
      className={`mx-auto min-h-screen w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </main>
  );
}

export default PageContainer;