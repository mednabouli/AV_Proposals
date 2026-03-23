"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type UserType = "freelance" | "agency" | null;
type Services = string[];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [services, setServices] = useState<Services>([]);
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [dailyRate, setDailyRate] = useState("");
  const [loading, setLoading] = useState(false);

  const serviceOptions = [
    { id: "promo_video", label: "Vidéo promotionnelle", label_en: "Promotional Video" },
    { id: "event_coverage", label: "Couverture événement", label_en: "Event Coverage" },
    { id: "corporate_video", label: "Vidéo corporative", label_en: "Corporate Video" },
    { id: "live_stream", label: "Diffusion en direct", label_en: "Live Stream" },
    { id: "animation", label: "Animation/Motion", label_en: "Animation/Motion" },
    { id: "drone", label: "Drone/Aérien", label_en: "Drone/Aerial" },
  ];

  const toggleService = (serviceId: string) => {
    setServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]
    );
  };

  const handleComplete = async () => {
    if (!userType || services.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_type: userType,
          services: services,
          language: language,
          daily_rate: dailyRate ? parseInt(dailyRate) : null,
        }),
      });

      if (response.ok) {
        router.push("/app");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = userType !== null;
  const isStep2Valid = services.length > 0;
  const isStep3Valid = true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Bienvenue sur AVProposal.ai</h1>
          <p className="text-slate-300">Quelques questions pour bien vous connaître</p>
        </div>

        {/* Progress */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex-1 h-2 mx-1 rounded-full ${
                stepNum <= step ? "bg-blue-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Step 1: User Type */}
        {step === 1 && (
          <Card className="border-0 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Êtes-vous freelance ou agence?</CardTitle>
              <CardDescription>Cela aide à personnaliser vos modèles de devis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={() => setUserType("freelance")}
                className={`w-full p-6 text-left border-2 rounded-lg transition ${
                  userType === "freelance"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-700 bg-slate-700/30 hover:border-slate-600"
                }`}
              >
                <h3 className="font-semibold text-white">🎬 Freelance</h3>
                <p className="text-sm text-slate-400 mt-1">Je travaille en solo ou avec des partenaires ponctuels</p>
              </button>

              <button
                onClick={() => setUserType("agency")}
                className={`w-full p-6 text-left border-2 rounded-lg transition ${
                  userType === "agency"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-700 bg-slate-700/30 hover:border-slate-600"
                }`}
              >
                <h3 className="font-semibold text-white">🏢 Agence</h3>
                <p className="text-sm text-slate-400 mt-1">Je gère une équipe ou une structure établie</p>
              </button>

              <div className="flex gap-4 pt-6">
                <Button variant="outline" onClick={() => router.push("/app")} className="flex-1">
                  Passer
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className="flex-1"
                >
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Services */}
        {step === 2 && (
          <Card className="border-0 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Quels services proposez-vous?</CardTitle>
              <CardDescription>Sélectionnez au moins un service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-4 text-left border-2 rounded-lg transition ${
                      services.includes(service.id)
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-700/30 hover:border-slate-600"
                    }`}
                  >
                    <p className="font-medium text-white text-sm">{language === "fr" ? service.label : service.label_en}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Retour
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!isStep2Valid}
                  className="flex-1"
                >
                  Suivant
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Language & Rate */}
        {step === 3 && (
          <Card className="border-0 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Préférences finales</CardTitle>
              <CardDescription>Langue par défaut et tarif journalier</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language */}
              <div>
                <label className="text-sm font-medium text-white mb-3 block">Langue par défaut</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLanguage("fr")}
                    className={`p-4 text-center border-2 rounded-lg transition ${
                      language === "fr"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-700/30"
                    }`}
                  >
                    <p className="font-medium text-white">🇫🇷 Français</p>
                  </button>
                  <button
                    onClick={() => setLanguage("en")}
                    className={`p-4 text-center border-2 rounded-lg transition ${
                      language === "en"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-700/30"
                    }`}
                  >
                    <p className="font-medium text-white">🇬🇧 English</p>
                  </button>
                </div>
              </div>

              {/* Daily Rate */}
              <div>
                <label className="text-sm font-medium text-white mb-3 block">
                  Tarif journalier moyen (CAD) — optionnel
                </label>
                <input
                  type="number"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  placeholder="ex. 1500"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Retour
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={loading || !isStep3Valid}
                  className="flex-1"
                >
                  {loading ? "Enregistrement..." : "Commencer!"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
