export function SignatureLogo() {
  return (
    <svg className="signature-logo" viewBox="0 0 441.71 273.92" role="img" aria-label="Agile Business">
      <defs>
        <clipPath id="signature-main-clip"><path d="M136 282 L278 -14 L326 -14 L202 282 Z" /></clipPath>
        <clipPath id="signature-return-clip"><path d="M128 206 L270 -10 L312 -10 L194 206 Z" /></clipPath>
        <clipPath id="signature-flourish-clip"><rect x="-10" y="66" width="255" height="132" /></clipPath>
        <clipPath id="signature-cross-clip"><rect x="188" y="91" width="264" height="72" /></clipPath>
        <clipPath id="signature-business-clip"><rect x="267" y="112" width="178" height="32" /></clipPath>

        <mask id="signature-main-mask" maskUnits="userSpaceOnUse" x="-20" y="-20" width="490" height="320">
          <path className="signature-mask-stroke signature-mask-1" d="M171 276 C193 221 236 125 298 -8" />
        </mask>
        <mask id="signature-return-mask" maskUnits="userSpaceOnUse" x="-20" y="-20" width="490" height="320">
          <path className="signature-mask-stroke signature-mask-2" d="M298 -8 C266 57 220 135 151 199" />
        </mask>
        <mask id="signature-flourish-mask" maskUnits="userSpaceOnUse" x="-20" y="-20" width="490" height="320">
          <path className="signature-mask-stroke signature-mask-3" d="M205 106 C171 80 126 79 76 92 C40 101 13 114 1 121 C38 139 126 133 229 127" />
        </mask>
        <mask id="signature-cross-mask" maskUnits="userSpaceOnUse" x="-20" y="-20" width="490" height="320">
          <path className="signature-mask-stroke signature-mask-4" d="M196 108 C270 111 354 111 448 110" />
        </mask>
      </defs>

      <g clipPath="url(#signature-main-clip)" mask="url(#signature-main-mask)"><image href="/brand-signature.svg" width="441.71" height="273.92" /></g>
      <g clipPath="url(#signature-return-clip)" mask="url(#signature-return-mask)"><image href="/brand-signature.svg" width="441.71" height="273.92" /></g>
      <g clipPath="url(#signature-flourish-clip)" mask="url(#signature-flourish-mask)"><image href="/brand-signature.svg" width="441.71" height="273.92" /></g>
      <g clipPath="url(#signature-cross-clip)" mask="url(#signature-cross-mask)"><image href="/brand-signature.svg" width="441.71" height="273.92" /></g>
      <g className="signature-business" clipPath="url(#signature-business-clip)"><image href="/brand-signature.svg" width="441.71" height="273.92" /></g>
      <image className="signature-complete" href="/brand-signature.svg" width="441.71" height="273.92" />
    </svg>
  );
}
