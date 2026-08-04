export function ProductVisual({ product }: { product: string }) {
  const isKpi = product === "agile-kpi" || product === "bi-analytics";
  const isWeb = product === "corporate-site";
  const isStrategy = product === "strategy";
  return (
    <div className={`product-visual ${isKpi ? "product-visual-kpi" : isWeb ? "product-visual-web" : isStrategy ? "product-visual-strategy" : "product-visual-call"}`} aria-hidden="true">
      <div className="visual-toolbar"><i /><i /><i /></div>
      <div className="visual-sidebar"><span /><span /><span /><span /></div>
      <div className="visual-canvas">
        {isKpi ? <><b className="visual-kpi-ring" /><b className="visual-kpi-bars"><i /><i /><i /><i /><i /></b><span className="visual-kpi-line" /></> : isWeb ? <><b className="visual-web-hero"><i /><i /></b><span className="visual-web-grid"><i /><i /><i /></span></> : isStrategy ? <><b className="visual-strategy-title" /><span className="visual-roadmap"><i /><i /><i /><i /></span></> : <><span className="visual-contact-row" /><span className="visual-contact-row" /><span className="visual-contact-row" /><b className="visual-call-wave" /></>}
      </div>
    </div>
  );
}
