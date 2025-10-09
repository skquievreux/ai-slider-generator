"use client";

import { useState } from "react";
import { usePresentationStore } from "@/lib/store";
import { PresentationFormData } from "@/types";

const STYLES = [
  { value: "business", label: "Business" },
  { value: "pitch", label: "Pitch Deck" },
  { value: "report", label: "Report" },
  { value: "education", label: "Education" },
];

const TEMPLATES = [
  { value: "techeroes-modern-2025", label: "Techeroes Modern" },
];

export function PresentationForm() {
  const { formData, setFormData, setIsGenerating, setGeneratedSlides } =
    usePresentationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.topic.trim()) return;

    setIsGenerating(true);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/generate-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate presentation");
      }

      const data = await response.json();
      setGeneratedSlides(data.slides || []);
    } catch (error) {
      console.error("Error generating presentation:", error);
      alert("Fehler bei der Generierung. Bitte versuchen Sie es erneut.");
    } finally {
      setIsGenerating(false);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof PresentationFormData,
    value: string | number,
  ) => {
    setFormData({ [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Präsentation erstellen</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Präsentationsthema *
          </label>
          <textarea
            id="topic"
            value={formData.topic}
            onChange={(e) => handleInputChange("topic", e.target.value)}
            placeholder="Beschreiben Sie Ihr Präsentationsthema..."
            className="input-field"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="slideCount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Anzahl Folien
            </label>
            <select
              id="slideCount"
              value={formData.slideCount}
              onChange={(e) =>
                handleInputChange("slideCount", parseInt(e.target.value))
              }
              className="input-field"
            >
              {Array.from({ length: 21 }, (_, i) => i + 5).map((num) => (
                <option key={num} value={num}>
                  {num} Folien
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="style"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Stil
            </label>
            <select
              id="style"
              value={formData.style}
              onChange={(e) => handleInputChange("style", e.target.value)}
              className="input-field"
            >
              {STYLES.map((style) => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="template"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Corporate Design Template
          </label>
          <select
            id="template"
            value={formData.templateId}
            onChange={(e) => handleInputChange("templateId", e.target.value)}
            className="input-field"
          >
            {TEMPLATES.map((template) => (
              <option key={template.value} value={template.value}>
                {template.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.topic.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Generiere Präsentation..."
            : "Präsentation generieren"}
        </button>
      </form>
    </div>
  );
}
