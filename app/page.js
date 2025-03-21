"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const calculators = [
    {
      title: "ROI - Classique",
      description: "Estimez votre retour sur investissement mensuel.",
      path: "/roi-calculator-main",
    },
    {
      title: "ROI - Cold Call",
      description: "Calcul basé sur un prix par RDV obtenu via cold call.",
      path: "/roi-calculator-cc",
    },
    {
      title: "ROI - Simplifié",
      description: "Version simplifiée du calculateur ROI.",
      path: "/roi-calculator-simple",
    },
    {
      title: "ROI - Autre",
      description: "Ajoutez d'autres calculateurs ici si nécessaire.",
      path: "/roi-calculator", // Exemple
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4] p-8 flex flex-col gap-6 items-center">
      <h1 className="text-3xl font-bold mb-6">Sélectionnez un calculateur ROI</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full max-w-5xl">
        {calculators.map((calc) => (
          <Card key={calc.path} className="hover:shadow-md transition">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-1">{calc.title}</h2>
                <p className="text-gray-500 text-sm">{calc.description}</p>
              </div>
              <Link href={calc.path}>
                <Button className="mt-4 w-full bg-[#fe490c] hover:bg-[#fd622d] text-white font-medium">
                  Accéder
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
