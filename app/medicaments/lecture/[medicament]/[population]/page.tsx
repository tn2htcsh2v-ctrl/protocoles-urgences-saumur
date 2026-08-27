import Link from "next/link";
import { notFound } from "next/navigation";
import { medicaments, type Population } from "../../../../../data/medicaments";
import LecteurPdf from "../../lecteur-pdf";

const PDF_URL = "/medicaments/livret-medicaments-urgence.pdf";

export function generateStaticParams() {
  return medicaments.flatMap((medicament, index) =>
    (Object.keys(medicament.pages) as Population[]).map((population) => ({
      medicament: String(index),
      population,
    })),
  );
}

function premierParametre(valeur: string | string[] | undefined) {
  return Array.isArray(valeur) ? valeur[0] : valeur;
}

export default async function LectureMedicamentPage({
  params,
  searchParams,
}: {
  params: Promise<{ medicament: string; population: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { medicament: indexTexte, population: populationTexte } = await params;
  const index = Number(indexTexte);
  const population = populationTexte as Population;
  const medicament = Number.isInteger(index) ? medicaments[index] : undefined;
  const page =
    medicament && (population === "adulte" || population === "pediatrie")
      ? medicament.pages[population]
      : undefined;

  if (!medicament || !page) notFound();

  const queryLecture = await searchParams;
  const recherche = premierParametre(queryLecture.q) ?? "";
  const filtreTexte = premierParametre(queryLecture.filtre);
  const filtre =
    filtreTexte === "adulte" || filtreTexte === "pediatrie"
      ? filtreTexte
      : "tous";
  const retourParams = new URLSearchParams();
  if (recherche) retourParams.set("q", recherche);
  if (filtre !== "tous") retourParams.set("filtre", filtre);
  const retourQuery = retourParams.toString();
  const retourHref = `/medicaments${retourQuery ? `?${retourQuery}` : ""}`;
  const populationLibelle = population === "pediatrie" ? "Pédiatrie" : "Adulte";

  return (
    <main className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-slate-200 text-slate-900">
      <header className="z-10 shrink-0 border-b border-slate-200 bg-white px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-sm sm:px-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={retourHref}
            className="inline-flex min-h-11 items-center self-start rounded-xl px-2 text-sm font-bold text-blue-700 hover:bg-blue-50 hover:text-blue-900"
          >
            ← Retour à la recherche
          </Link>

          <div className="min-w-0 flex-1 sm:px-4 sm:text-center">
            <h1 className="truncate text-base font-bold sm:text-lg">{medicament.dci}</h1>
            <p className="text-sm font-semibold text-slate-500">{populationLibelle}</p>
          </div>

          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center self-stretch rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 sm:self-auto"
          >
            Ouvrir le PDF complet
          </a>
        </div>
      </header>

      <LecteurPdf pageInitiale={page} />
    </main>
  );
}
