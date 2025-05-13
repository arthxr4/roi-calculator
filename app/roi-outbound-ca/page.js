"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
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

function Calculator() {
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent?.postMessage({ frameHeight: height }, "*");
    };

    sendHeight();
    window.addEventListener("resize", sendHeight);
    return () => window.removeEventListener("resize", sendHeight);
  }, []);

  const getCloseRateLabel = (rate) => {
    if (rate < 7) return "Très bas";
    if (rate < 10) return "Bas";
    if (rate < 15) return "Moyen";
    if (rate < 36) return "Bon";
    return "Excellent";
  };
  
  const getCloseRateColor = (rate) => {
    if (rate < 7) return "bg-red-100 text-red-600";
    if (rate < 10) return "bg-orange-100 text-orange-600";
    if (rate < 15) return "bg-yellow-100 text-yellow-600";
    if (rate < 36) return "bg-green-200 text-green-700";
    return "bg-green-100 text-green-600";
  };

  const searchParams = useSearchParams();

  const getParam = (key, fallback) => {
    const value = searchParams.get(key);
    return value ? Number(value) : fallback;
  };
  
  const [closeRate, setCloseRate] = useState(() => getParam("closeRate", 33));
  const [contractValue, setContractValue] = useState(() => getParam("contractValue", 2500));
  const [investment, setInvestment] = useState(() => getParam("investment", 2500));

  // Nouveau state pour le CA mensuel souhaité
  const caSteps = [
    0,
    1000, 2000, 3000, 4000, 5000,
    6000, 7000, 8000, 9000, 10000,
    15000, 20000, 30000, 40000, 50000,
    60000, 70000, 80000, 90000, 100000
  ];
  const [caSouhaite, setCaSouhaite] = useState(10000);
  const caIndex = caSteps.findIndex(v => v === caSouhaite);

  // Calcul du nombre de RDV nécessaires pour atteindre le CA
  const rdvNecessaires = Math.ceil(caSouhaite / (contractValue * (closeRate / 100)));
  
  // Calcul du nombre de prospects à contacter avec taux fixe de 1%
  const contacts = Math.ceil(rdvNecessaires / 0.01);
  
  // Calcul des coûts des outils de prospection
  const calculateToolsCost = () => {
    // Calcul du nombre de domaines nécessaires (1 domaine = 75 mails/jour = ~1500 mails/mois)
    const domainsNeeded = Math.ceil(contacts / 1500);
    const emailsNeeded = domainsNeeded * 3; // 3 emails par domaine

    const costs = {
      // Infrastructure email (coûts fixes + variables)
      domains: domainsNeeded * 1.5, // 1.5€/mois par domaine (15€/an)
      googleWorkspace: emailsNeeded * 6, // 6€/mois par email
      warmup: 40, // Coût fixe pour le warm-up

      // Outils d'envoi d'emails (coûts fixes)
      sendingtool: 97, //  Pour l'envoi d'emails

      // Outils de scraping (coûts fixes + variables)
      phantombuster: 59, // Coût fixe de base
      scrapingCredits: contacts * 0.005, // 0.005€ par prospect

      // Outils d'enrichissement (coûts fixes + variables)
      dropcontact: 39, // Coût fixe de base
      enrichmentCredits: contacts * 0.10, // 0.10€ par contact enrichi

      // Vérification des emails (coût variable)
      emailVerification: contacts * 0.008, // 0.008€ par email vérifié

      // CRM (gratuit pour commencer)
      crm: 0, // Hubspot version gratuite
    };

    // Calcul du total mensuel
    const totalMonthlyCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    return {
      costs,
      totalMonthlyCost,
      details: {
        domainsNeeded,
        emailsNeeded,
        emailsPerMonth: contacts
      }
    };
  };

  const toolsCost = calculateToolsCost();
  
  // Résultats à droite
  const rdvObtenus = rdvNecessaires;
  const closed = Math.round(rdvNecessaires * (closeRate / 100));
  const salesPerMonth = closed * contractValue;
  const roi = salesPerMonth / toolsCost.totalMonthlyCost;
  const [isEditingInvestment, setIsEditingInvestment] = useState(false);

  const [springs, api] = useSprings(3, (index) => ({
    from: { number: 0 },
    number: [salesPerMonth, toolsCost.totalMonthlyCost, roi][index],
    config: { tension: 400, friction: 15 },
  }));

  useEffect(() => {
    api.start((index) => ({
      number: [salesPerMonth, toolsCost.totalMonthlyCost, roi][index],
    }));
  }, [salesPerMonth, toolsCost.totalMonthlyCost, roi, api]);

  // Nouveau tableau de crans pour les contacts (4 intervalles entre chaque légende)
  const contactsSteps = [0, 200, 400, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 18000, 26000, 34000, 42000, 50000];
  const contactsIndex = contactsSteps.findIndex(v => v === contacts);

  // Ajout d'une fonction pour le badge du taux de prise de RDV
  const getRdvRateLabel = (rate) => {
    if (rate < 0.2) return "Très bas";
    if (rate < 0.5) return "Bas";
    if (rate < 1) return "Moyen";
    if (rate < 1.5) return "Bon";
    return "Excellent";
  };
  const getRdvRateColor = (rate) => {
    if (rate < 0.2) return "bg-red-100 text-red-600";
    if (rate < 0.5) return "bg-orange-100 text-orange-600";
    if (rate < 1) return "bg-yellow-100 text-yellow-600";
    if (rate < 1.5) return "bg-green-200 text-green-700";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#F4F4F4] p-4">
      <div className="p-4 gap-4 rounded-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-[45%_55%] gap-0">
        {/* Partie Gauche */}
        <div className="border border-gray-200 bg-[#fcfcfc] p-6 md:p-6 shadow-sm rounded-xl flex flex-col justify-between">
        <div>
          {/* Vos objectifs */}
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 tracking-wider">Votre objectif</h3>
          {/* CA mensuel souhaité */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="font-medium text-standard text-base">CA mensuel</label>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Info size={16} className="text-[#98A1AC] cursor-help" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm p-3 max-w-[300px]">
                      Objectif de chiffre d'affaires mensuel à atteindre.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                type="number"
                value={caSouhaite}
                onChange={e => {
                  let value = Number(e.target.value);
                  if (value < 0) value = 0;
                  if (value > 100000) value = 100000;
                  // Snap to closest cran
                  const closest = caSteps.reduce((prev, curr) =>
                    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
                  );
                  setCaSouhaite(closest);
                }}
                min={0}
                max={100000}
                step={1000}
                className="flex h-[40px] p-sm justify-between items-center shrink-0 self-stretch font-normal text-base align-middle border border-border-light bg-white w-[75px] rounded-md text-center text-standard"
              />
            </div>
        
            <Slider
              value={[caIndex === -1 ? 0 : caIndex]}
              min={0}
              max={caSteps.length - 1}
              step={1}
              onValueChange={([idx]) => setCaSouhaite(caSteps[idx])}
            />
            <div className="mt-2 flex justify-between text-xs text-gray-500 relative h-6 px-2">
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">0</span></span>
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">5k</span></span>
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">10k</span></span>
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">50k</span></span>
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">100k</span></span>
            </div>
          </div>
          <div className="border-b border-gray-200 mb-8" />

          {/* Vos metrics */}
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 tracking-wider">Vos metrics</h3>
         

          {/* Taux de closing */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="font-medium text-standard text-base">Taux de closing (%)</label>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Info size={16} className="text-[#98A1AC] cursor-help" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm p-3 max-w-[300px]">
                      Pourcentage de rendez-vous qui aboutissent à une vente.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${getCloseRateColor(closeRate)}`}>{getCloseRateLabel(closeRate)}</span>
              </div>
              <Input
                type="number"
                value={closeRate}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  if (value < 0) value = 0;
                  if (value > 100) value = 100;
                  setCloseRate(value);
                }}
                className="flex h-[40px] p-sm justify-between items-center shrink-0 self-stretch font-normal text-base align-middle border border-border-light bg-white w-[75px] rounded-md text-center text-standard"
              />
            </div>
           
            <Slider
              value={[closeRate]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setCloseRate(value[0])}
              onPointerUp={() => document.activeElement.blur()}
            />
            <div className="mt-2 flex justify-between text-xs text-gray-500 relative h-6 px-2">
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">0</span></span>
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">25</span></span>
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">50</span></span>
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">75</span></span>
              <span className="relative"><span className="absolute left-1/2 -translate-x-1/2">100</span></span>
            </div>
          </div>

          {/* Valeur contrat */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="font-medium text-standard text-base">Valeur contrat</label>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Info size={16} className="text-[#98A1AC] cursor-help" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm p-3 max-w-[300px]">
                      Montant moyen généré par un contrat signé.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex h-[40px] pr-2 justify-between items-center self-stretch rounded-[10px] border border-[#EFEFEF] bg-white shadow-[0px_8px_8px_-6px_rgba(0,0,0,0.05)]">
              <div className="flex w-[36px] h-[36px] flex-col justify-center items-center gap-[10px] flex-shrink-0 rounded-[8px] border border-[#EFEFEF] bg-gradient-to-b from-white to-[#F7F7F7] shadow-[0px_0px_0px_2px_#FFF_inset,0px_15px_4px_0px_rgba(0,0,0,0.00),0px_10px_4px_0px_rgba(0,0,0,0.01),0px_5px_3px_0px_rgba(0,0,0,0.02),0px_2px_2px_0px_rgba(0,0,0,0.04),0px_1px_1px_0px_rgba(0,0,0,0.05)]">
                <span className="text-sm text-muted-foreground">€</span>
              </div>
              <input
                type="number"
                value={contractValue}
                onChange={(e) => setContractValue(Math.min(100000, Math.max(1000, Number(e.target.value))))}
                className="flex-1 mx-2 text-center text-[#213856] font-inter text-base leading-[24px] font-normal bg-transparent border-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={1000}
                max={100000}
                step={1000}
              />
              <div className="flex flex-col mr-2 gap-1">
                <button type="button" onClick={() => setContractValue(v => Math.min(100000, v + 1000))} className="flex items-center justify-center text-[#687588] hover:text-[#213856] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M7 4.5L4 1.5L1 4.5" stroke="#566F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </button>
                <button type="button" onClick={() => setContractValue(v => Math.max(1000, v - 1000))} className="flex items-center justify-center text-[#687588] hover:text-[#213856] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M7 1.5L4 4.5L1 1.5" stroke="#566F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                </button>
              </div>
            </div>
          </div>
          </div>
          <div className="mt-5 flex justify-center">
            <img src="/aveliuslogodots.png" alt="Avelius Logo" className="w-28 opacity-90" />
          </div>
        </div>

        {/* Partie Droite */}
        <div className=" border border-gray-200 bg-[#FFFFFF] flex flex-col p-8 shadow-sm rounded-xl">
     
         
          {/* Lignes CA généré, Coûts outils, ROI - style carte vertical */}
        
          <div className="border-b pb-9">
            <p className="text-sm font-normal text-gray-800 mb-2">Rendez-vous nécessaires</p>
            <p className="text-3xl font-bold text-black md:text-4xl">
              {Math.round(rdvNecessaires)} RDV
            </p>
          </div>
          <div className="border-b pb-9 pt-9">
            <p className="text-sm font-normal text-gray-800 mb-2 flex items-center">Coûts outils
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2">
                      <Info size={16} className="text-gray-500 cursor-help" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="text-sm p-3 max-w-[300px]">
                    <div className="space-y-2">
                      <p>Coûts mensuels des outils de prospection :</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Infrastructure ({toolsCost.details.domainsNeeded} domaines, {toolsCost.details.emailsNeeded} emails) : {Math.round(toolsCost.costs.domains + toolsCost.costs.googleWorkspace + toolsCost.costs.warmup)}€</li>
                        <li>Envoi d'emails : {toolsCost.costs.sendingtool}€</li>
                        <li>Scraping ({toolsCost.details.emailsPerMonth} prospects) : {Math.round(toolsCost.costs.phantombuster + toolsCost.costs.scrapingCredits)}€</li>
                        <li>Enrichissement : {Math.round(toolsCost.costs.dropcontact + toolsCost.costs.enrichmentCredits)}€</li>
                        <li>Vérification emails : {Math.round(toolsCost.costs.emailVerification)}€</li>
                        
                      </ul>
                      <p className="text-xs text-gray-500 mt-2">
                        * Coûts calculés pour {toolsCost.details.emailsPerMonth} prospects/mois
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
            <p className="text-3xl font-bold text-black md:text-4xl">
              {Math.round(toolsCost.totalMonthlyCost)} €
            </p>
          </div>
        
          <div className="pb-9 pt-9">
            <p className="text-sm font-normal text-gray-800 mb-2 flex items-center">ROI
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-2">
                      <Info size={16} className="text-gray-500 cursor-help" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="text-sm p-3 max-w-[300px]">
                    Retour sur investissement = CA généré / Coûts outils
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </p>
            <p className="text-4xl font-bold text-[#ff5e00] md:text-5xl">
              <animated.span>
                {springs[2].number.to((n) => `x${(salesPerMonth/toolsCost.totalMonthlyCost).toFixed(1)}`)}
              </animated.span>
            </p>
          </div>

          <a
            href="https://calendly.com/avelius/appel-de-decouverte"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-8"
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

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Calculator />
    </Suspense>
  );
}
