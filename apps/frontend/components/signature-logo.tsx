export function SignatureLogo() {
  return (
    <svg className="signature-logo" viewBox="0 0 441.71 273.92" role="img" aria-label="Agile Business">
      <defs>
        <clipPath id="signature-business-clip"><rect x="267" y="112" width="178" height="32" /></clipPath>
      </defs>
      <g className="signature-ink">
        <path className="signature-stroke signature-stroke-1" pathLength="1" d="M171 272 C190 226 230 137 294 2" />
        <path className="signature-stroke signature-stroke-2" pathLength="1" d="M294 2 C267 53 225 122 160 186" />
        <path className="signature-stroke signature-stroke-3" pathLength="1" d="M160 186 C177 149 193 118 205 106 C170 82 126 80 77 92 C42 101 15 113 3 121 C36 136 116 132 205 128" />
        <path className="signature-stroke signature-stroke-4" pathLength="1" d="M205 109 C270 111 351 111 441 110" />
      </g>
      <g className="signature-business" clipPath="url(#signature-business-clip)"><image href="/brand-signature.svg" width="441.71" height="273.92" /></g>
      <image className="signature-complete" href="/brand-signature.svg" width="441.71" height="273.92" />
    </svg>
  );
}
