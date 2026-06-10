import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-copa-blue text-lg font-black text-copa-yellow">
                CT
              </span>
              <span className="text-lg font-bold text-copa-blue">
                Copa<span className="text-copa-green">Turbo</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-600">
              Ferramenta para comerciantes criarem promoções que trazem mais clientes nos dias de jogo da Copa.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-copa-blue">Produto</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/planos" className="hover:text-copa-green">
                  Planos
                </Link>
              </li>
              <li>
                <Link href="/criar" className="hover:text-copa-green">
                  Criar campanha
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-copa-blue">Suporte</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/#faq" className="hover:text-copa-green">
                  Perguntas frequentes
                </Link>
              </li>
              <li>
                <span className="text-slate-400">contato@copaturbo.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Copa Turbo. Todos os direitos reservados.
          </p>
          <p className="text-xs text-slate-400">
            Feito para bares, adegas e comércios locais 🇧🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
