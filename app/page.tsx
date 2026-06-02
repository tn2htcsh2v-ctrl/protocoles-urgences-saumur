import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const specialites = [
    "Anesthésie-Réanimation",
    "Cardiologie - Vasculaire",
    "Endocrinologie",
    "Gériatrie",
    "Hépatologie - Gastro-entérologie",
    "Hématologie",
    "Neurologie",
    "Métabolique",
    "Ophtalmo - ORL",
    "Pneumologie",
    "Rhumatologie",
    "Toxicologie",
    "Traumatologie",
    "Urologie - Néphrologie",
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-4 pb-24 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white text-slate-900 rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex flex-col items-center">
            <Image
              src="/logo-smur49.png"
              alt="SMUR 49"
              width={180}
              height={180}
              className="h-auto w-auto"
            />

            <h1 className="text-3xl md:text-4xl font-bold text-center mt-4 text-slate-900">
              Protocoles des Urgences
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mt-2 text-center">
              Centre Hospitalier de Saumur
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {specialites.map((specialite) => (
            <Link
              key={specialite}
              href={`/specialite/${encodeURIComponent(specialite)}`}
              className="bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl text-left font-semibold block text-lg"
            >
              {specialite}
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Link
            href="/annuaire"
            className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-xl font-bold text-center"
          >
            📞 Annuaire
          </Link>

          <Link
            href="/recherche"
            className="bg-slate-700 hover:bg-slate-800 text-white p-5 rounded-xl font-bold text-center"
          >
            🔎 Recherche
          </Link>

          <Link
            href="/outils"
            className="bg-purple-600 hover:bg-purple-700 text-white p-5 rounded-xl font-bold text-center"
          >
            🧮 Outils
          </Link>
        </div>
      </div>
    </main>
  );
}