"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // 🔥 Import Framer Motion
import { useSpring, useSprings, animated } from "@react-spring/web"; // 🚀 Pour animer les nombres

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input"; // ✅ Importer le composant Input de ShadCN
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react"; // Icône d'information
import { ChevronDown } from "lucide-react";



export default function Home() {
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      console.log("🔥 Hauteur envoyée :", height); // ✅ Vérification

      // Correction : Utiliser "*" pour autoriser toutes les origines
      window.parent?.postMessage({ frameHeight: height }, "*");
    };

    sendHeight();
    window.addEventListener("resize", sendHeight);
    return () => window.removeEventListener("resize", sendHeight);
  }, []);
  
  const SECTOR_DATA = { 
    "Banque & Finance": { appointments: 10, closeRate: 12, contractValue: 55000, salesCycle: 6, ranges: [3, 6, 10, 15] }, 
    "Conseil en Stratégie & Management": { appointments: 8, closeRate: 18, contractValue: 80000, salesCycle: 2, ranges: [4, 7, 12, 17] }, 
    "Analyse de Données & Intelligence Artificielle": { appointments: 11, closeRate: 22, contractValue: 100000, salesCycle: 3, ranges: [5, 8, 13, 18] }, 
    "Formation & E-learning": { appointments: 18, closeRate: 10, contractValue: 22500, salesCycle: 2, ranges: [2, 5, 8, 12] }, 
    "Énergies & Services Environnementaux": { appointments: 10, closeRate: 14, contractValue: 80000, salesCycle: 9, ranges: [3, 6, 11, 16] }, 
    "Événementiel & Communication": { appointments: 15, closeRate: 12, contractValue: 27500, salesCycle: 2, ranges: [3, 6, 10, 14] }, 
    "Fintech & Cryptomonnaies": { appointments: 10, closeRate: 18, contractValue: 120000, salesCycle: 3, ranges: [5, 9, 14, 20] }, 
    "Logiciels & SaaS": { appointments: 15, closeRate: 16, contractValue: 52500, salesCycle: 1, ranges: [4, 7, 11, 15] }, 
    "Médias & Production Audiovisuelle": { appointments: 12, closeRate: 10, contractValue: 40000, salesCycle: 2, ranges: [2, 5, 9, 12] }, 
    "Marketing Digital & Publicité": { appointments: 18, closeRate: 12, contractValue: 26000, salesCycle: 2, ranges: [1, 4, 7, 10] }, 
    "Recrutement & Ressources Humaines": { appointments: 15, closeRate: 14, contractValue: 30000, salesCycle: 2, ranges: [3, 6, 10, 14] }, 
    "Immobilier & Services Juridiques": { appointments: 12, closeRate: 18, contractValue: 60000, salesCycle: 5, ranges: [4, 7, 12, 17] },
    "Industrie & Fabrication": { appointments: 10, closeRate: 13, contractValue: 50000, salesCycle: 6, ranges: [5, 8, 13, 18] },  
    "Développement Logiciel & IT": { appointments: 12, closeRate: 14, contractValue: 65000, salesCycle: 3, ranges: [3, 6, 11, 16] }, 
    "Transport & Mobilité": { appointments: 10, closeRate: 12, contractValue: 72500, salesCycle: 5, ranges: [3, 6, 11, 16] }, 
    "SEO & Growth Marketing": { appointments: 18, closeRate: 10, contractValue: 20000, salesCycle: 1, ranges: [1, 3, 6, 9] } 
};
  
  const DEFAULT_SECTOR = "Banque & Finance"; // 🔥 Secteur par défaut


  
  const getCloseRateLabel = (rate, sector) => {
    if (!sector || !SECTOR_DATA[sector]) return "Inconnu";
    const [veryLow, low, medium, good] = SECTOR_DATA[sector].ranges;
  
    if (rate < veryLow) return "Très faible";
    if (rate < low) return "Faible";
    if (rate < medium) return "Moyen";
    if (rate < good) return "Bon";
    return "Excellent";
  };
  
  const getCloseRateColor = (rate, sector) => {
    if (!sector || !SECTOR_DATA[sector]) return "bg-gray-200 text-gray-600";
    const [veryLow, low, medium, good] = SECTOR_DATA[sector].ranges;
  
    if (rate < veryLow) return "bg-red-100 text-red-600";
    if (rate < low) return "bg-orange-100 text-orange-600";
    if (rate < medium) return "bg-yellow-100 text-yellow-600";
    if (rate < good) return "bg-green-200 text-green-700";
    return "bg-green-100 text-green-600";
  };
  

  
const [selectedSector, setSelectedSector] = useState(DEFAULT_SECTOR);
const [appointments, setAppointments] = useState(SECTOR_DATA[DEFAULT_SECTOR].appointments);
const [closeRate, setCloseRate] = useState(SECTOR_DATA[DEFAULT_SECTOR].closeRate);
const [contractValue, setContractValue] = useState(SECTOR_DATA[DEFAULT_SECTOR].contractValue);
const [salesCycle, setSalesCycle] = useState(6); // 6 mois par défaut

const [isFocused, setIsFocused] = useState(false);
const [subscription, setSubscription] = useState(2500);
 
const [investment, setInvestment] = useState(30000);
const [isAnimating, setIsAnimating] = useState(false); // Pour détecter un changement et lancer l'animation


  useEffect(() => {
    if (selectedSector) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600); // Reset après animation
    }
  }, [appointments, closeRate, contractValue]);

  // Fonction pour gérer le changement de secteur
const handleSectorChange = (sector) => {
  setSelectedSector(sector);
  updateValues(sector, subscription);
};

// Fonction pour gérer le changement d'abonnement
const handleSubscriptionChange = (value) => {
  setSubscription(value);
  setInvestment(value * 12); // ✅ Corrige l'investissement annuel
  
  if (selectedSector) {
    updateValues(selectedSector, value);
  }
};



const updateValues = (sector, subscriptionValue) => {
  if (SECTOR_DATA[sector]) {
    const multiplier = subscriptionValue === 4000 ? 2 : 1;
    setAppointments(SECTOR_DATA[sector].appointments * multiplier);
    setCloseRate(SECTOR_DATA[sector].closeRate);
    setContractValue(SECTOR_DATA[sector].contractValue);
    setSalesCycle(SECTOR_DATA[sector].salesCycle); // 🔥 Mettre à jour le cycle de vente
  }
};

  


  const salesPerYear = (appointments * (closeRate / 100) * contractValue * (12 / salesCycle));

  const roi = ((salesPerYear - investment) / investment) * 100;

  const [springs, api] = useSprings(3, (index) => ({
    from: { number: 0 },
    number: [salesPerYear, investment, roi][index], 
    config: { tension: 250, friction: 25 }, // ⚡️ Ajuste pour une animation fluide mais rapide
  }));
  

  // Mettre à jour les valeurs animées
  useEffect(() => {
    api.start((index) => ({
      number: [salesPerYear, investment, roi][index],
    }));
  }, [salesPerYear, investment, roi, api]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
       <div className="p-4">
      
      
    
          </div>
      <div className="bg-white p-0 rounded-xl shadow-md w-full max-w-5xl grid grid-cols-1 md:grid-cols-[65%_35%] gap-0">
        {/* Partie Gauche - Formulaire */}
        
        <div className="bg-[#FBFBFB] p-6 md:p-8 rounded-t-xl md:rounded-none md:rounded-l-xl">
       

          <h2 className="text-sm font-medium text-gray-500 mb-2">
            Choisissez votre abonnement
          </h2>

          
      

          {/* Sélecteur d'abonnement sous forme de boutons */}
          <div className="flex gap-4 mb-6 bg-[#FFFFFF] border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => handleSubscriptionChange(2500)}
              className={`w-1/2 py-1 text-sm font-medium  focus:outline-none rounded-sm text-sm  transition ${
                subscription === 2500
                  ? "bg-[#FFF1EB] text-[#ff5e00] border-[#ff5e00] shadow shadow-xs"
                  : "border-gray-300 text-[#71717a] text-black"
              }`}
            >
              Growth
            </button>
            <button
              onClick={() => handleSubscriptionChange(4000)}
              className={`w-1/2 py-1 text-sm font-medium focus:outline-none rounded-sm text-sm transition ${
                subscription === 4000
                  ? "bg-[#FFF1EB] text-[#ff5e00] border-[#ff5e00] shadow shadow-xs"
                  : "border-gray-300 text-[#71717a] text-black"
              }`}
            >
              Growth Plus
            </button>
          </div>

          <div
      onClick={() => document.getElementById("sector-select")?.click()} // Rend toute la div cliquable
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`border bg-white rounded-lg px-4 py-3 mb-4 w-full transition 
        ${isFocused ? "border-gray-400" : "border-gray-200"}
        focus-within:border-gray-400 cursor-pointer`}
    >
      <label className="block text-sm mb-2 font-medium text-gray-500">
        Sélectionner votre secteur
      </label>

      <Select onValueChange={handleSectorChange} value={selectedSector}>
  <SelectTrigger
    id="sector-select"
    className="w-full border-none pl-0 bg-white shadow-none rounded-md focus:ring-0 focus:border-none"
  >
    <SelectValue placeholder="Sélectionnez un secteur" />
  </SelectTrigger>

  <SelectContent className="w-full">
    {Object.keys(SECTOR_DATA).map((sector) => (
      <SelectItem key={sector} value={sector} className="hover:bg-gray-100 w-full py-3">
        {sector}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
    </div>


        

<div className="border border-gray-200 bg-white rounded-lg px-4 py-3 mb-4 w-full transition focus-within:border-gray-400 relative">
  <div className="flex justify-between items-center">
    <label className="block text-sm font-medium text-gray-500 flex items-center">
      Nombre moyen de RDV par mois
      {/* Tooltip pour expliquer l'estimation */}
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-2">
              <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="text-sm p-3 rounded-md shadow-md max-w-[300px] text-left">
            Estimation basée sur notre expérience dans ce secteur. Les résultats peuvent varier selon votre activité et marché cible.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </label>
  </div>

  {/* Input */}
  <Input
    type="number"
    value={appointments}
    onChange={(e) => {
      let value = Number(e.target.value);
      if (value < 1) value = 1;
      if (value > 40) value = 40;
      setAppointments(value);
    }}
    className="w-full h-8 font-medium mb-1 border-none p-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
  />

  {/* Slider */}
  <Slider
    value={[appointments]} 
    min={1}
    max={50}
    step={1}
    onValueChange={(value) => setAppointments(value[0])}
    onPointerUp={() => document.activeElement.blur()}
    className=""
  />
</div>



         
        {/* Taux de conversion (%) */}
<div className="border border-gray-200 bg-white rounded-lg px-4 py-3 mb-4 w-full transition focus-within:border-gray-400 relative">
  {/* Label + Tooltip + Indicateur */}
  <div className="flex justify-between items-center">
    <label className="text-sm font-medium text-gray-500 flex items-center">
      Taux de conversion après rendez-vous (%)
      
      {/* Icône + Tooltip avec apparition rapide */}
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-2">
              <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="text-sm p-3 rounded-md shadow-md max-w-[300px] text-left">
            Très dépendant de votre secteur d'activité. Pour calculer ce pourcentage, divisez le nombre de ventes réalisées  
            par le nombre de devis envoyés.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </label>

    {/* Indicateur dynamique avec segmentation affinée */}
    <span
  className={`text-xs font-medium px-2 py-1 rounded-lg transition ${getCloseRateColor(closeRate, selectedSector)}`}
>
  {getCloseRateLabel(closeRate, selectedSector)}
</span>

  </div>

  {/* Input */}
  <Input
    type="number"
    value={closeRate}
    onChange={(e) => {
      let value = Number(e.target.value);
      if (value < 1) value = 1;
      if (value > 100) value = 100;
      setCloseRate(value);
    }}
    className="w-full h-8 font-medium mb-1 border-none p-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
  />

  {/* Slider */}
  <Slider
    value={[closeRate]} 
    min={1}
    max={100}
    step={1}
    onValueChange={(value) => setCloseRate(value[0])}
    onPointerUp={() => document.activeElement.blur()}
    className=""
  />
</div>

          



{/* Valeur annuelle du contrat (€) */}
<div className="border border-gray-200 bg-white rounded-lg px-4 py-3 mb-4 w-full transition focus-within:border-gray-400">
  <label className="block text-sm font-medium text-gray-500 flex items-center">
    Valeur annuelle d'un contrat (€)

    {/* Icône + Tooltip */}
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-2">
            <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="text-sm p-3 rounded-md shadow-md max-w-[300px] text-left">
          Chiffre d'affaires annuel moyen généré par  
          chaque contrat client, hors frais additionnels.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </label>

  <Input
    type="number"
    value={contractValue}
    onChange={(e) => {
      let value = Number(e.target.value);
      if (value < 0) value = 0;
      if (value > 500000) value = 500000;
      setContractValue(value);
    }}
    className="w-full h-8 font-medium mb-1 border-none p-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
  />

  <Slider
    value={[contractValue]} 
    min={2000}
    max={500000}
    step={1000}
    onValueChange={(value) => setContractValue(value[0])}
    onPointerUp={() => document.activeElement.blur()}
    className=""
  />
</div>

{/* Cycle de Vente (en mois) */}
<div className="border border-gray-200 bg-white rounded-lg px-4 py-3 mb-4 w-full transition focus-within:border-gray-400 relative">
  <div className="flex justify-between items-center">
    <label className="text-sm font-medium text-gray-500 flex items-center">
      Cycle de vente (mois)
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-2">
              <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="text-sm p-3 rounded-md shadow-md max-w-[300px] text-left">
            Durée moyenne entre la prise de contact et la signature du contrat.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </label>
  </div>

  {/* Input affichant la valeur actuelle */}
  <Input
    type="number"
    value={salesCycle}
    onChange={(e) => {
      let value = Number(e.target.value);
      if (value < 1) value = 1;
      if (value > 18) value = 18; // Max 18 mois
      setSalesCycle(value);
    }}
    className="w-full h-8 font-medium mb-1 border-none p-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
  />

  {/* Slider pour ajuster la valeur */}
  <Slider
    value={[salesCycle]} 
    min={1}
    max={24}
    step={1}
    onValueChange={(value) => setSalesCycle(value[0])}
    onPointerUp={() => document.activeElement.blur()}
    className=""
  />
</div>


<div className="mt-auto flex justify-center mt-5">
    <img src="/aveliuslogodots.png" alt="Avelius Logo" className="w-28 opacity-90" />
  </div>
          
        </div>

        

        {/* Partie Droite - Résultats avec alignement à gauche et dividers */}
        <div className="flex flex-col p-8 rounded-l-xl">
          
      
          <div className="border-b pb-9">
            <h3 className="text-sm font-normal text-gray-800 mb-2">Vos ventes annuelles</h3>
            <p className="text-3xl font-bold text-black md:text-4xl">
    <animated.span>
      {springs[0].number.to((n) => Math.round(n).toLocaleString("fr-FR"))}
    </animated.span> €
  </p>

          </div>



          {/* Bloc "Votre investissement annuel" avec tooltip */}
<div className="border-b pb-9 pt-9 items-center justify-between">
  <h3 className="text-sm font-normal text-gray-800 mb-2 flex items-center">
    Votre investissement annuel
    {/* Icône + Tooltip */}
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-2">
            <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
          </span>
        </TooltipTrigger>
        <TooltipContent className=" text-sm p-3 rounded-md shadow-md max-w-[300px] text-left">
          Dépends de l’abonnement choisi
          au tarif public. Les prix peuvent varier en fonction d'offres spécifiques 
          ou de conditions particulières au secteur.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </h3>

  {/* Affichage du montant formaté */}
  <p className="text-3xl font-bold text-black md:text-4xl">
    <animated.span>
      {springs[1].number.to((n) => Math.round(n).toLocaleString("fr-FR"))}
    </animated.span> €
  </p>
</div>


          <div className=" pb-9 pt-9">
            <h3 className="text-sm font-normal text-gray-800 mb-2">Retour sur investissement</h3>
           <p className="text-4xl font-bold text-[#ff5e00] md:text-5xl">
    <animated.span>
      {springs[2].number.to((n) => Math.round(n).toLocaleString("fr-FR"))}
    </animated.span> %
  </p>
          </div>

     
          <Button className="bg-[#ff5e00] hover:bg-[#e04b00] font-medium text-white py-5">
          Discuter du tarif
</Button>


          
        </div>
      </div>
    </div>
  );
}
