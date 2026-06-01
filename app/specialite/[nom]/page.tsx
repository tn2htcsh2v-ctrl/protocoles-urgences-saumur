import { protocoles } from "../../../data/protocoles";

export default async function Page({
  params,
}: {
  params: Promise<{ nom: string }>;
}) {
  const { nom } = await params;

  const specialite = decodeURIComponent(nom);

  const liste =
    protocoles[specialite as keyof typeof protocoles] || [];

  return (
    <main className="min-h-screen bg-slate-100 p-4 pb-24">
  <a
  href="/"
  className="inline-block mb-6 text-blue-600 font-semibold"
>
  ← Retour à l'accueil
</a>
        <h1 className="text-3xl font-bold mb-6">
          {specialite}
        </h1>

{liste.length === 0 ? (
  <p className="text-gray-600">
    Aucun protocole disponible actuellement.
  </p>
) : (
  <div className="space-y-3">
    {liste.map((protocole, index) => (
      <a
        key={index}
        href={typeof protocole === "string" ? "#" : protocole.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-blue-50 border border-blue-200 rounded-2xl p-5 hover:bg-blue-100 text-lg"
      >
        📄 {typeof protocole === "string" ? protocole : protocole.titre}
      </a>
    ))}
  </div>
)}
    </main>
  );
}