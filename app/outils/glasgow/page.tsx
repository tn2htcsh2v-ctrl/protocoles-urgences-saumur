"use client";

import { useState } from "react";
import Link from "next/link";

export default function GlasgowPage() {
  const [yeux, setYeux] = useState(4);
  const [verbal, setVerbal] = useState(5);
  const [moteur, setMoteur] = useState(6);

  const score = yeux + verbal + moteur;

  return (
    <main className="min-h-screen bg-slate-100 p-4 pb-24 text-slate-900">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 text-slate-900">
        <Link href="/outils" className="inline-block mb-6 text-blue-600 font-semibold">
          ← Retour aux outils
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          Score de Glasgow
        </h1>

        <p className="text-gray-600 mb-6">
          Évaluation de l’état de conscience : ouverture des yeux, réponse verbale et réponse motrice.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 text-center">
          <div className="text-lg text-gray-600">Score total</div>
          <div className="text-5xl font-bold text-blue-700 mt-2">
            GCS {score}/15
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">Ouverture des yeux</h2>
            <select
              value={yeux}
              onChange={(e) => setYeux(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl p-4 text-lg"
            >
              <option value={4}>4 - Spontanée</option>
              <option value={3}>3 - À la demande</option>
              <option value={2}>2 - À la douleur</option>
              <option value={1}>1 - Aucune</option>
            </select>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Réponse verbale</h2>
            <select
              value={verbal}
              onChange={(e) => setVerbal(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl p-4 text-lg"
            >
              <option value={5}>5 - Orientée</option>
              <option value={4}>4 - Confuse</option>
              <option value={3}>3 - Mots inappropriés</option>
              <option value={2}>2 - Sons incompréhensibles</option>
              <option value={1}>1 - Aucune</option>
            </select>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Réponse motrice</h2>
            <select
              value={moteur}
              onChange={(e) => setMoteur(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-xl p-4 text-lg"
            >
              <option value={6}>6 - Obéit aux ordres</option>
              <option value={5}>5 - Localise la douleur</option>
              <option value={4}>4 - Retrait à la douleur</option>
              <option value={3}>3 - Flexion anormale</option>
              <option value={2}>2 - Extension anormale</option>
              <option value={1}>1 - Aucune</option>
            </select>
          </section>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          À utiliser comme aide au calcul. L’interprétation reste clinique.
        </div>
      </div>
    </main>
  );
}