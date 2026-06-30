"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-blue-50">
      <div className="flex flex-col items-center gap-4 rounded-2xl border bg-white p-8 shadow-sm">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-800">
          Algo salió mal
        </h2>
        <p className="max-w-md text-center text-sm text-gray-500">
          {error.message || "Ocurrió un error inesperado al cargar la aplicación."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
