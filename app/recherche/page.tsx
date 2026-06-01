"use client";

import { useState } from "react";
import { protocoles } from "../../data/protocoles";
import { annuaire } from "../../data/annuaire";

export default function RecherchePage() {
  const [recherche, setRecherche] = useState("");

  const tousLesProtocoles = Object.entries(protocoles).flatMap(
    ([specialite, liste]) =>
      liste.map((protocole) => ({
        specialite,
        titre: typeof protocole === "string" ? protocole : protocole.titre,
        url: typeof protocole === "string" ? "" : protocole.url,
      }))
  );

  const resultats = tousLesProtocoles.filter(
    (protocole) =>
      protocole.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      protocole.specialite.toLowerCase().includes(recherche.toLowerCase())
  );

  const resultatsAnnuaire = annuaire.filter(
    (contact) =>
      contact.service.toLowerCase().includes(recherche.toLowerCase()) ||
      contact.fonction.toLowerCase().includes(recherche.toLowerCase()) ||
      contact.numero.includes(recherche)
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <a href="/" className="inline-block mb-6 text-blue-600 font-semibold">
          ← Retour à l'accueil
        </a>

        <h1 className="text-3xl font-bold mb-6">Recherche globale</h1>

        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un protocole, un médecin, un service ou un numéro..."
          className="w-full border border-gray-300 rounded-xl p-4 mb-6"
        />

        <h2 className="text-2xl font-bold mb-4">📄 Protocoles</h2>

        <div className="space-y-3">
          {resultats.map((protocole, index) => (
            <a
              key={index}
              href={protocole.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-blue-50 border border-blue-200 rounded-xl p-4 hover:bg-blue-100"
            >
              📄 {protocole.titre}
              <div className="text-sm text-gray-500 mt-1">
                {protocole.specialite}
              </div>
            </a>
          ))}
        </div>

        {resultatsAnnuaire.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">📞 Annuaire</h2>

            <div className="space-y-3">
              {resultatsAnnuaire.map((contact, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 rounded-xl p-4"
                >
                  <div className="font-bold">{contact.fonction}</div>
                  <div className="text-gray-600">{contact.service}</div>
                  <div className="text-xl font-bold mt-2">
                    {contact.numero}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}