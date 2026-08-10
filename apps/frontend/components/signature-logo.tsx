export function SignatureLogo() {
  return (
    <svg className="signature-logo" viewBox="0 0 441.71 273.92" role="img" aria-label="Agile Business">
      <defs>
        <clipPath id="signature-business-clip"><rect x="267" y="112" width="178" height="32" /></clipPath>
        <mask id="signature-continuous-mask" maskUnits="userSpaceOnUse" x="-20" y="-20" width="490" height="320">
          <path
            className="signature-continuous-path"
            pathLength="1000"
            d="M171 276 C193 221 236 125 298 -8 C266 57 220 135 151 199 C176 151 192 119 205 106 C171 80 126 79 76 92 C40 101 13 114 1 121 C38 139 126 133 229 127 C288 115 365 111 448 110"
          />
        </mask>
      </defs>

      <image className="signature-drawing" href="/brand-signature.svg" width="441.71" height="273.92" mask="url(#signature-continuous-mask)" />
      <g className="signature-business" clipPath="url(#signature-business-clip)"><image href="/brand-signature.svg" width="441.71" height="273.92" /></g>
      <image className="signature-complete" href="/brand-signature.svg" width="441.71" height="273.92" />
    </svg>
  );
}
