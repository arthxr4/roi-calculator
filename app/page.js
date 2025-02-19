"use client";
import { useState } from "react";

export default function Home() {
  const [subscription, setSubscription] = useState(2500);
  const [appointments, setAppointments] = useState(15);
  const [closeRate, setCloseRate] = useState(30);
  const [contractValue, setContractValue] = useState(18000);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Calculateur de ROI
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Partie Gauche - Formulaire */}
        <div>
          <h2 className="text-sm font-normal text-gray-700 mb-2">
            Choisissez votre abonnement
          </h2>

          {/* Sélecteur d'abonnement sous forme de boutons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleSubscriptionChange(2500)}
              className={`w-1/2 py-3 rounded-lg text-sm font-semibold border  focus:outline-none hover:bg-gray-100  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 transition ${
                subscription === 2500
                  ? "bg-[#FFF1EB] text-[#ff5e00] border-[#ff5e00]"
                  : "border-gray-300"
              }`}
            >
              Growth
            </button>
            <button
              onClick={() => handleSubscriptionChange(4000)}
              className={`w-1/2 py-3 rounded-lg text-sm font-semibold  border focus:outline-none hover:bg-gray-100  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 transition ${
                subscription === 4000
                  ? " bg-[#FFF1EB] text-[#ff5e00] border-[#ff5e00]"
                  : "border-gray-300"
              }`}
            >
              Growth Plus
            </button>
          </div>

          {/* Nombre moyen de RDV par mois */}
          <label className="block text-sm font-normal text-gray-700">Nombre moyen de RDV par mois</label>
          <input
            type="range"
            min="1"
            max="50"
            value={appointments}
            onChange={(e) => setAppointments(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 accent-orange-600 rounded-lg cursor-pointer range-slider"
          />
          <p className="text-gray-500 text-sm mb-4">{appointments.toLocaleString("fr-FR")} RDV/mois</p>

          {/* Taux de conversion après RDV */}
          <label className="block text-sm font-normal text-gray-700">Taux de conversion (%)</label>
          <input
            type="range"
            min="1"
            max="100"
            value={closeRate}
            onChange={(e) => setCloseRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-500 accent-orange-600 rounded-lg cursor-pointer range-slider"
          />
          <p className="text-gray-500 text-sm mb-4">{closeRate.toLocaleString("fr-FR")}%</p>

          {/* Valeur annuelle du contrat */}
          <label className="block text-sm font-normal text-gray-700">Valeur annuelle du contrat (€)</label>
          <input
            type="range"
            min="1000"
            max="500000"
            step="1000"
            value={contractValue}
            onChange={(e) => setContractValue(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 accent-orange-600 rounded-lg cursor-pointer range-slider"
          />
          <p className="text-gray-500 text-sm mb-4">{contractValue.toLocaleString("fr-FR")} €</p>
        </div>

        {/* Partie Droite - Résultats avec alignement à gauche et dividers */}
        <div className="flex flex-col">
          <div className="border-b pb-8">
            <h3 className="text-sm font-normal text-gray-700">Vos ventes annuelles</h3>
            <p className="text-2xl font-bold text-black">{salesPerYear.toLocaleString("fr-FR")} €</p>
          </div>

          <div className="border-b pb-8 pt-8">
            <h3 className="text-sm font-normal text-gray-700">Votre investissement annuel</h3>
            <p className="text-2xl font-bold text-black">{investment.toLocaleString("fr-FR")} €</p>
          </div>

          <div className=" pb-8 pt-8">
            <h3 className="text-sm font-normal text-gray-700">Retour sur investissement</h3>
            <p className="text-4xl font-bold text-[#ff5e00]">{roi.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
