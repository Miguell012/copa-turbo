"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#exemplos", label: "Exemplos" },
  { href: "/planos", label: "Planos" },
  { href: "/#faq", label: "FAQ" },
  { href: "/dashboard", label: "Minhas campanhas" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-copa-blue/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-copa-yellow text-lg font-black text-copa-blue">
            CT
          </span>
          <span className="text-lg font-bold text-white">
            Copa<span className="text-copa-yellow">Turbo</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-copa-yellow whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden items-center lg:flex">
          <Link href="/criar" className="btn-primary !py-2.5 !text-sm whitespace-nowrap">
            Criar minha campanha
          </Link>
        </div>

        {/* Botão hamburger mobile */}
        <button
          type="button"
          className="rounded-lg p-2 text-white lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-copa-blue lg:hidden">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10">
              <Link
                href="/criar"
                className="btn-primary block text-center"
                onClick={() => setMenuOpen(false)}
              >
                Criar minha campanha
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
