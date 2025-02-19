"use client";
import { useState } from "react";

export default function Home() {
  const [appointments, setAppointments] = useState(10);
  const [closeRate, setCloseRate] = useState(10);
  const [contractValue, setContractValue] = useState(100000);
  const [investment, setInvestment] = useState(108000);

  const salesPerYear = appointments * (closeRate / 100) * contractValue * 12;
  const roi = ((salesPerYear - investment) / investment) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">ROI Calculator</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Monthly Appointments */}
        <label className="block text-gray-700">Monthly Appointments</label>
        <input
          type="number"
          value={appointments}
          onChange={(e) => setAppointments(Number(e.target.value))}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Close Rate */}
        <label className="block text-gray-700">Close Rate (%)</label>
        <input
          type="number"
          value={closeRate}
          onChange={(e) => setCloseRate(Number(e.target.value))}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Annual Contract Value */}
        <label className="block text-gray-700">Annual Contract Value ($)</label>
        <input
          type="number"
          value={contractValue}
          onChange={(e) => setContractValue(Number(e.target.value))}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Investment */}
        <label className="block text-gray-700">Yearly Investment ($)</label>
        <input
          type="number"
          value={investment}
          onChange={(e) => setInvestment(Number(e.target.value))}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Output */}
        <div className="mt-6 p-4 bg-gray-200 rounded text-center">
          <p className="text-lg font-semibold">
            Sales Per Year: ${salesPerYear.toLocaleString()}
          </p>
          <p className="text-lg font-semibold text-green-600">
            ROI: {roi.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
