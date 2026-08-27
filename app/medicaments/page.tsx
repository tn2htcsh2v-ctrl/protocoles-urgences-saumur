"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { medicaments, type Population } from "../../data/medicaments";

type Filtre = "tous" | Population;

const filtres: { valeur: Filtre; libelle: string }[] = [
  { valeur: "tous", libelle: "Tous" },
  { valeur: "adulte", libelle: "Adulte" },
  { valeur: "pediatrie", libelle: "Pédiatrie" },
];

function normaliser(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}

function BoutonPopulation({
  population,
  page,
  medicamentIndex,
  recherche,
  filtre,
}: {
  population: Population;
  page: number;
  medicamentIndex: number;
  recherche: string;
  filtre: Filtre;
}) {
  const pediatrie = population === "pediatrie";
  const parametres = new URLSearchParams();
  if (recherche) parametres.set("q", recherche);
  if (filtre !== "tous") parametres.set("filtre", filtre);
  const query = parametres.toString();

  return (
    <Link
      href={`/medicaments/lecture/${medicamentIndex}/${population}${query ? `?${query}` : ""}`}
      aria-label={`Lire la fiche ${pediatrie ? "pédiatrique" : "adulte"} à la page ${page}`}
      className={`inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
        pediatrie
          ? "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 focus-visible:outline-teal-600"
          : "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 focus-visible:outline-blue-600"
      }`}
    >
      {pediatrie ? "Pédiatrie" : "Adulte"}
      <span className="ml-2 text-xs font-medium opacity-70">p. {page}</span>
    </Link>
  );
}

function GuideMedicaments() {
  const searchParams = useSearchParams();
  const filtreInitial = searchParams.get("filtre");
  const [recherche, setRecherche] = useState(searchParams.get("q") ?? "");
  const [filtre, setFiltre] = useState<Filtre>(
    filtreInitial === "adulte" || filtreInitial === "pediatrie"
      ? filtreInitial
      : "tous",
  );

  useEffect(() => {
    const parametres = new URLSearchParams();
    if (recherche) parametres.set("q", recherche);
    if (filtre !== "tous") parametres.set("filtre", filtre);

    const query = parametres.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `/medicaments${query ? `?${query}` : ""}`,
    );
  }, [filtre, recherche]);

  const resultats = useMemo(() => {
    const termes = normaliser(recherche).trim().split(/\s+/).filter(Boolean);

    return medicaments.filter((medicament) => {
      if (filtre !== "tous" && !medicament.pages[filtre]) return false;

      const contenu = normaliser(`${medicament.dci} ${medicament.nomCommercial}`);
      return termes.every((terme) => contenu.includes(terme));
    });
  }, [filtre, recherche]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 pb-24 text-slate-900 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-5 inline-flex min-h-11 items-center text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Retour à l&apos;accueil
        </Link>

        <section className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <header className="bg-gradient-to-br from-cyan-700 to-blue-800 px-5 py-7 text-white sm:px-8 sm:py-9">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-cyan-100">
              Aide cognitive IDE
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Guide médicamenteux
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
              Recherchez une DCI ou un nom commercial, puis ouvrez directement
              la fiche validée dans le livret PDF.
            </p>
          </header>

          <div className="border-b border-slate-200 p-4 sm:p-6">
            <label htmlFor="recherche-medicament" className="mb-2 block text-sm font-bold text-slate-700">
              Rechercher un médicament
            </label>
            <div className="relative">
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                🔎
              </span>
              <input
                id="recherche-medicament"
                type="search"
                value={recherche}
                onChange={(event) => setRecherche(event.target.value)}
                placeholder="Ex. adrénaline, Cordarone…"
                autoComplete="off"
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-base outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="mt-4 flex gap-2" role="group" aria-label="Filtrer par population">
              {filtres.map(({ valeur, libelle }) => {
                const actif = filtre === valeur;
                return (
                  <button
                    key={valeur}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => setFiltre(valeur)}
                    className={`min-h-11 flex-1 rounded-xl px-3 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      actif
                        ? "bg-blue-700 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {libelle}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:px-6" aria-live="polite">
            <strong className="text-slate-900">{resultats.length}</strong>{" "}
            {resultats.length > 1 ? "résultats" : "résultat"}
          </div>

          <div className="divide-y divide-slate-200">
            {resultats.map((medicament) => {
              const medicamentIndex = medicaments.indexOf(medicament);

              return (
              <article key={`${medicament.dci}-${medicament.nomCommercial}`} className="p-4 sm:p-6">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold leading-snug text-slate-900">
                    {medicament.dci}
                  </h2>
                  <p className="mt-1 break-words text-sm font-medium leading-5 text-slate-500">
                    {medicament.nomCommercial}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {medicament.pages.adulte && (
                    <BoutonPopulation
                      population="adulte"
                      page={medicament.pages.adulte}
                      medicamentIndex={medicamentIndex}
                      recherche={recherche}
                      filtre={filtre}
                    />
                  )}
                  {medicament.pages.pediatrie && (
                    <BoutonPopulation
                      population="pediatrie"
                      page={medicament.pages.pediatrie}
                      medicamentIndex={medicamentIndex}
                      recherche={recherche}
                      filtre={filtre}
                    />
                  )}
                </div>
              </article>
              );
            })}

            {resultats.length === 0 && (
              <div className="px-6 py-14 text-center">
                <p className="text-lg font-bold text-slate-800">Aucun médicament trouvé</p>
                <p className="mt-2 text-sm text-slate-500">
                  Essayez une autre DCI, un nom commercial ou le filtre « Tous ».
                </p>
              </div>
            )}
          </div>
        </section>

        <p className="mx-auto mt-5 max-w-2xl px-2 text-center text-xs leading-5 text-slate-500">
          Le livret PDF validé reste la source médicale de référence. Les doses
          et préparations ne sont pas reproduites dans l&apos;application.
        </p>
      </div>
    </main>
  );
}

export default function MedicamentsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-100" />}>
      <GuideMedicaments />
    </Suspense>
  );
}
