function Loader({ text = "Loading..." }) {
  return (
    <div className="flex min-h-50 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-emerald-500" />

        <p className="text-sm text-zinc-400">
          {text}
        </p>
      </div>
    </div>
  );
}

export default Loader;