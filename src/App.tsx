import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "./components/features/Navbar";
import { Hero } from "./components/features/Hero";
import { Results } from "./components/features/Results";
import { ErrorMessage } from "./components/features/ErrorMessage";
import { Footer } from "./components/features/Footer";
import { Loader } from "./components/ui/Loader";
import { analyzeUrl } from "./lib/parser";

export default function App() {
  const [url, setUrl] = useState<string | null>(null);
  const [queryKey, setQueryKey] = useState(0);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["analyze", url, queryKey],
    queryFn: () => analyzeUrl(url!),
    enabled: !!url,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const handleSubmit = (submittedUrl: string) => {
    setUrl(submittedUrl);
  };

  const handleReset = () => {
    setUrl(null);
  };

  const handleRefresh = () => {
    setQueryKey((prev) => prev + 1);
    refetch();
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overscroll-none">
      <Navbar />

      {!url && (
        <Hero onSubmit={handleSubmit} isLoading={isLoading} isHidden={false} />
      )}

      {url && isLoading && (
        <section className="min-h-screen flex items-center justify-center">
          <Loader />
        </section>
      )}

      {isError && (
        <ErrorMessage
          message={error instanceof Error ? error.message : "Failed to analyze"}
          onRetry={handleReset}
        />
      )}

      {data && !isLoading && (
        <Results
          data={data}
          onReset={handleReset}
          onRefresh={handleRefresh}
          isRefreshing={isRefetching}
        />
      )}

      <Footer />
    </div>
  );
}

