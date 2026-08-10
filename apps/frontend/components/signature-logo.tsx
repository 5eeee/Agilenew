const signaturePath =
  "M212.351 -592.839 C212.351 -592.839 335.821 -324.053 335.821 -324.053 C336.488 -322.593 335.168 -321.982 334.229 -323.284 C334.229 -323.284 201.131 -506.341 201.131 -506.341 C200.929 -506.621 200.499 -506.349 200.67 -506.049 C211.352 -487.196 249.798 -422.341 218.395 -407.49 C185.402 -391.888 101.54 -413.037 45.915 -439.802 C11.191 -456.51 232.175 -452.518 296.003 -450.807 C296.855 -450.784 298.369 -450.629 299.216 -450.527 C302.673 -450.112 305.657 -446.689 304.701 -442.967 C299.031 -420.908 264.439 -424.804 251.311 -427.343 C217.816 -433.822 513.333 -431.732 513.333 -431.732";

export function SignatureLogo() {
  return (
    <svg className="signature-logo" viewBox="30 310 500 300" role="img" aria-label="Agile Business">
      <path className="signature-draw-path" d={signaturePath} transform="scale(1 -1)" fill="none" stroke="#e30613" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <image className="signature-final-art" href="/brand-signature-clean.svg" x="0" y="0" width="595.276" height="841.89" />
    </svg>
  );
}
