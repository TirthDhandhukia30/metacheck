interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-xs text-muted-foreground mb-2">
          Unable to analyze
        </p>
        <p className="text-base text-foreground mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors duration-200"
          >
            Try another URL
          </button>
        )}
      </div>
    </section>
  );
}
