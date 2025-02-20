"use client";
import { useState, useEffect } from "react";

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
  

  const [subscription, setSubscription] = useState(2500);
  const [appointments, setAppointments] = useState(15);
  const [closeRate, setCloseRate] = useState(13);
  const [contractValue, setContractValue] = useState(15000);
  const [investment, setInvestment] = useState(30000);

  // Mise à jour de l'investissement et des RDV en fonction de l'abonnement choisi
  const handleSubscriptionChange = (value) => {
    setSubscription(value);
    setInvestment(value * 12); // 2500€ = 30 000€, 4000€ = 48 000€
    setAppointments(value === 2500 ? 15 : 30); // 15 RDV pour 2500€, 30 RDV pour 4000€
  };

  

  const salesPerYear = appointments * (closeRate / 100) * contractValue * 12;
  const roi = ((salesPerYear - investment) / investment) * 100;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#F4F4F4] p-6">
       
      
      <h1 className="text-5xl font-extrabold mb-6 text-center text-gray-800">
        Calculateur de <span className="text-[#ff5e00]">ROI</span>
      </h1>
      <h2 className="text-md text-center font-normal text-gray-700 mb-9 max-w-3xl">
          Quel revenu et quel retour sur investissement pouvez-vous obtenir avec Avelius ? Utilisez notre calculateur pour voir les résultats réels que nous pouvons obtenir pour votre entreprise 👇
          </h2>
          
      <div className="bg-white p-0 rounded-xl shadow-md w-full max-w-4xl grid grid-cols-1 md:grid-cols-[55%_45%] gap-0">
        {/* Partie Gauche - Formulaire */}
        <div className="bg-[#FBFBFB] p-8 rounded-l-xl">
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
          <div className="border border-gray-200 bg-white rounded-lg px-4 py-3 mb-4 w-full transition focus-within:border-gray-400">
  <label className="block text-sm font-medium text-gray-500">
    Nombre moyen de RDV par mois
  </label>

  {/* Input sans bordure mais qui déclenche le focus sur la div */}
  <Input
    type="number"
    value={appointments}
    onChange={(e) => {
      let value = Number(e.target.value);
      if (value < 1) value = 1;
      if (value > 50) value = 50;
      setAppointments(value);
    }}
    className="w-full h-8 font-medium mb-1 border-none p-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
  />


  
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
      Taux de conversion (%)
      
      {/* Icône + Tooltip avec apparition rapide */}
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-2">
              <Info size={18} className="text-gray-500 hover:text-[#ff5e00]" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="text-sm p-3 rounded-md shadow-md max-w-[300px] text-left">
            Pour calculer ce pourcentage, divisez le nombre de ventes réalisées  
            par le nombre de devis envoyés.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </label>

    {/* Indicateur dynamique avec segmentation affinée */}
    <span
      className={`text-xs font-medium px-2 py-1 rounded-lg transition
        ${closeRate < 3 ? "bg-red-100 text-red-600" : 
          closeRate < 5 ? "bg-orange-100 text-orange-600" : 
          closeRate < 10 ? "bg-yellow-100 text-yellow-600" : 
          closeRate < 15 ? "bg-green-200 text-green-700" :
          "bg-green-100 text-green-600"}
      `}
    >
      {closeRate < 3 ? "Très faible" : 
       closeRate < 5 ? "Faible" : 
       closeRate < 10 ? "Moyen" : 
       closeRate < 15 ? "Bon" : 
       "Excellent"}
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

          
          
        </div>

        

        {/* Partie Droite - Résultats avec alignement à gauche et dividers */}
        <div className="flex flex-col p-8 rounded-l-xl">
          <div className="border-b pb-8">
            <h3 className="text-sm font-normal text-gray-800 mb-1">Vos ventes annuelles</h3>
            <p className="text-4xl font-bold text-black">{salesPerYear.toLocaleString("fr-FR")} €</p>
          </div>



          {/* Bloc "Votre investissement annuel" avec tooltip */}
<div className="border-b pb-8 pt-8 items-center justify-between">
  <h3 className="text-sm font-normal text-gray-800 mb-1 flex items-center">
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
  <p className="text-4xl font-bold text-black">
    {investment.toLocaleString("fr-FR")} €
  </p>
</div>


          <div className=" pb-8 pt-8">
            <h3 className="text-sm font-normal text-gray-800 mb-1">Retour sur investissement</h3>
            <p className="text-5xl font-bold text-[#ff5e00]">{roi.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%</p>
          </div>

     
          <Button className="bg-[#ff5e00] hover:bg-[#e04b00] font-medium text-white">
          Discuter du tarif
</Button>


          
        </div>
      </div>
    </div>
  );
}
