import { annuaire } from "../../data/annuaire";
export default function AnnuairePage() {
  const services = Array.from(new Set(annuaire.map((contact) => contact.service)));

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <a href="/" className="inline-block mb-6 text-blue-600 font-semibold">
          ← Retour à l'accueil
        </a>

        <h1 className="text-3xl font-bold mb-6">Annuaire</h1>

        <div className="space-y-8">
          {services.map((service) => (
            <section key={service}>
              <h2 className="text-2xl font-bold mb-3">{service}</h2>

              <div className="space-y-3">
                {annuaire
                  .filter((contact) => contact.service === service)
                  .map((contact, index) => (
                    <div
                      key={index}
                      className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between gap-4"
                    >
                      <div className="font-semibold">{contact.fonction}</div>
                      <div className="text-xl font-bold">{contact.numero}</div>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}