export function Spinner({ size = 'md' }) {
  const sz = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';
  return (
    <div className={`${sz} border-2 border-coral-400 border-t-transparent rounded-full animate-spin`} />
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center px-4">
      <div className="text-4xl">😕</div>
      <p className="text-gray-500">{message || 'Something went wrong'}</p>
    </div>
  );
}

export function EmptyState({ message, icon = '📌' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center px-4">
      <div className="text-5xl">{icon}</div>
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  );
}