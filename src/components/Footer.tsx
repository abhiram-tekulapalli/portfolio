/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative w-full border-t border-border-brand bg-bg-brand py-16 overflow-hidden">
      {/* Ghost backdrop Watermark */}
      <div 
        id="footer-watermark" 
        className="pointer-events-none absolute inset-x-0 bottom-6 select-none text-center font-display text-[11rem] font-extrabold text-white/[0.02] tracking-widest leading-none sm:text-[14rem] lg:text-[16rem]"
      >
        TPA
      </div>

      <div id="footer-content" className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <p className="font-display text-sm font-medium tracking-wide text-white/80">
          Designed & Built by <span className="text-white hover:underline cursor-pointer">Tekulapalli Abhiram</span>
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
          © 2024 - {currentYear} · All rights reserved · Built in Full Stack CJS
        </p>
      </div>
    </footer>
  );
}
