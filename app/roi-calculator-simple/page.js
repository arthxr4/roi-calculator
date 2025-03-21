"use client";
import { useState, useEffect } from "react";
import { useSprings, animated } from "@react-spring/web";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default function Home() {
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent?.postMessage({ frameHeight: height }, "*");
    };

    sendHeight();
    window.addEventListener("resize", sendHeight);
    return () => window.removeEventListener("resize", sendHeight);
  }, []);

  const [appointments, setAppointments] = useState(10);
  const [closeRate, setCloseRate] = useState(20);
  const [contractValue, setContractValue] = useState(55000);
  const [investment, setInvestment] = useState(2500);

  const salesPerMonth = appointments * (closeRate / 100) * contractValue;
  const roi = salesPerMonth / investment;
  const [isEditingInvestment, setIsEditingInvestment] = useState(false);


  const [springs, api] = useSprings(3, (index) => ({
    from: { number: 0 },
    number: [salesPerMonth, investment, roi][index],
    config: { tension: 400, friction: 15 },
  }));

  useEffect(() => {
    api.start((index) => ({
      number: [salesPerMonth, investment, roi][index],
    }));
  }, [salesPerMonth, investment, roi, api]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-transparent p-4">
      <div className="bg-white p-0 rounded-xl shadow-md w-full max-w-5xl grid grid-cols-1 md:grid-cols-[65%_35%] gap-0">
        {/* Partie Gauche */}
        <div className="bg-[#FBFBFB] p-6 md:p-8 rounded-t-xl md:rounded-none md:rounded-l-xl flex flex-col justify-between">
        <div>
          {/* RDV / Mois */}
          <div className="border border-gray-200 bg-white rounded-lg px-4 py-3 mb-4 w-full">
            <label className="block text-sm font-medium text-gray-500 flex items-center">
              Nombre moyen de RDV par mois
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2">
                      <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="text-sm p-3 max-w-[300px]">
                    Estimation selon votre activité. Résultats variables selon le secteur et le marché.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>

            <Input
              type="number"
              value={appointments}
              onChange={(e) => setAppointments(Math.max(1, Number(e.target.value)))}
              className="w-full h-8 font-medium mb-1 border-none bg-transparent shadow-none focus-visible:ring-0"
            />
            <Slider
              value={[appointments]}
              min={1}
              max={100}
              step={1}
              onValueChange={(value) => setAppointments(value[0])}
            />
          </div>

          {/* Taux de conversion */}
          <div className="border border-gray-200 bg-white rounded-lg px-4 py-3 mb-4 w-full">
            <label className="block text-sm font-medium text-gray-500 flex items-center">
              Taux de conversion (%)
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2">
                      <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="text-sm p-3 max-w-[300px]">
                    Pourcentage de RDV qui aboutissent à une vente.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>

            <Input
              type="number"
              value={closeRate}
              onChange={(e) => setCloseRate(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-full h-8 font-medium mb-1 border-none bg-transparent shadow-none focus-visible:ring-0"
            />
            <Slider
              value={[closeRate]}
              min={1}
              max={100}
              step={1}
              onValueChange={(value) => setCloseRate(value[0])}
            />
          </div>

          {/* Valeur contrat */}
          <div className="border border-gray-200 bg-white rounded-lg px-4 py-3 mb-4 w-full">
            <label className="block text-sm font-medium text-gray-500 flex items-center">
              Valeur d'un contrat (€)
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2">
                      <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="text-sm p-3 max-w-[300px]">
                    Revenu annuel moyen généré par un client.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>

            <Input
              type="number"
              value={contractValue}
              onChange={(e) => setContractValue(Math.min(100000, Math.max(1000, Number(e.target.value))))}
              className="w-full h-8 font-medium mb-1 border-none bg-transparent shadow-none focus-visible:ring-0"
            />
            <Slider
              value={[contractValue]}
              min={1000}
              max={100000}
              step={1000}
              onValueChange={(value) => setContractValue(value[0])}
            />
          </div>
          </div>
          <div className="mt-5 flex justify-center">
            <img src="/aveliuslogodots.png" alt="Avelius Logo" className="w-28 opacity-90" />
          </div>
        </div>

        {/* Partie Droite */}
        <div className="flex flex-col p-8 rounded-l-xl">

          <div className="border-b pb-9">
            <p className="text-sm font-normal text-gray-800 mb-2">Vos ventes mensuelles</p>
            <p className="text-3xl font-bold text-black md:text-4xl">
              <animated.span>
                {springs[0].number.to((n) => Math.round(n).toLocaleString("fr-FR"))}
              </animated.span> €
            </p>
          </div>

          <div className="border-b pb-9 pt-9">
  <p className="text-sm font-normal text-gray-800 mb-2 flex items-center">
    Votre investissement mensuel
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-2">
            <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-sm p-3 max-w-[300px] text-left">
          En fonction de votre abonnement Avelius.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </p>

  {/* Affichage ou édition */}
  <div className="text-3xl font-bold text-black md:text-4xl">
    {isEditingInvestment ? (
      <input
        type="number"
        value={investment}
        onChange={(e) => setInvestment(Number(e.target.value))}
        onBlur={() => setIsEditingInvestment(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setIsEditingInvestment(false);
        }}
        autoFocus
        className="w-full bg-transparent border-none outline-none text-3xl md:text-4xl font-bold"
      />
    ) : (
      <span
        onClick={() => setIsEditingInvestment(true)}
        className="cursor-pointer hover:text-[#fe490c] transition"
      >
        {Math.round(investment).toLocaleString("fr-FR")} €
      </span>
    )}
  </div>
</div>


          <div className="pb-9 pt-9">
            <p className="text-sm font-normal text-gray-800 mb-2">Retour sur investissement</p>
            <p className="text-4xl font-bold text-[#ff5e00] md:text-5xl">
              <animated.span>
                {springs[2].number.to((n) => `x${(n).toFixed(1)}`)}
              </animated.span>
            </p>
          </div>

          <a
            href="https://calendly.com/avelius/appel-de-decouverte"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full border border-[#fe490c] bg-[#fe490c] bg-gradient-to-t from-[#fe490c] to-[#fd622d] backdrop-blur-md text-white text-center text-[16px] rounded-lg py-5 px-4 font-semibold shadow-[inset_0_1px_0.4px_#ffffff4d,inset_0_-1px_0.4px_#0000001f] transition-all duration-200 hover:brightness-110">
              Nous contacter
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
