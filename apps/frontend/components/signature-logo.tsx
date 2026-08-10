export function SignatureLogo() {
  return (
    <svg className="signature-logo" viewBox="0 0 441.71 273.92" role="img" aria-label="Agile Business">
      <defs>
        <mask id="signature-draw-mask" maskUnits="userSpaceOnUse" x="-20" y="-20" width="490" height="320">
          <rect x="-20" y="-20" width="490" height="320" fill="black" />
          <path className="signature-stroke signature-stroke-1" pathLength="1" d="M171 273 C190 230 229 142 294 1" />
          <path className="signature-stroke signature-stroke-2" pathLength="1" d="M294 1 C260 54 211 128 159 186" />
          <path className="signature-stroke signature-stroke-3" pathLength="1" d="M159 186 C174 129 178 92 139 85 C91 76 32 101 3 121 C52 139 142 128 229 127" />
          <path className="signature-stroke signature-stroke-4" pathLength="1" d="M205 109 C265 112 348 112 441 110" />
          <rect className="signature-business-mask" x="267" y="112" width="178" height="32" rx="2" fill="white" />
        </mask>
      </defs>
      <image href="/brand-signature.svg" width="441.71" height="273.92" mask="url(#signature-draw-mask)" />
    </svg>
  );
}
