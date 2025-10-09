"use client";

import { PresentationForm } from "@/components/PresentationForm";
import { SlidePreview } from "@/components/SlidePreview";
import { ExportButtons } from "@/components/ExportButtons";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import GoogleLogin from "@/components/GoogleLogin";
import { usePresentationStore } from "@/lib/store";

export default function Home() {
  const { isGenerating, generatedSlides } = usePresentationStore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <GoogleLogin />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Slides Generator
          <span className="ml-4 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
            v1.0.2
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Erstellen Sie professionelle Präsentationen in wenigen Minuten mit
          KI-Unterstützung
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <PresentationForm />
          {isGenerating && <LoadingIndicator />}
        </div>

        <div className="space-y-6">
          {generatedSlides.length > 0 && (
            <>
              <SlidePreview />
              <ExportButtons />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
