type OrbitFieldProps = {
  variant?: "home" | "products";
  className?: string;
};

const homeRoute = "M76 646 C286 421 475 378 690 419 C916 462 1084 445 1270 344 C1402 272 1492 180 1528 91";
const homeReturnRoute = "M92 669 C318 768 570 728 793 603 C1019 476 1213 333 1580 356";
const productsRoute = "M744 248 C927 379 1129 398 1342 316 C1458 272 1533 215 1635 170";

export function OrbitField({ variant = "home", className = "" }: OrbitFieldProps) {
  const products = variant === "products";
  const gradientId = `orbit-gradient-${variant}`;
  const glowId = `orbit-glow-${variant}`;

  return (
    <svg
      className={`orbit-field ${className}`}
      viewBox="0 0 1600 850"
      role="img"
      aria-label={products ? "Two API request paths crossing a shared infrastructure layer" : "Callback and Retry requests moving along aligned network paths"}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8c63ff" />
          <stop offset="0.48" stopColor="#1dd7ed" />
          <stop offset="1" stopColor="#428cff" />
        </linearGradient>
        <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {products ? (
        <g className="orbit-products">
          <path className="orbit-line orbit-line--faint" d="M754 202 C954 78 1238 71 1518 196" />
          <path className="orbit-line orbit-line--faint" d="M820 294 C1003 119 1246 146 1394 290 C1472 367 1532 398 1624 405" />
          <path className="orbit-line orbit-line--major" stroke={`url(#${gradientId})`} d={productsRoute} />
          <path className="orbit-line orbit-line--violet" d="M824 138 C1010 333 1214 449 1602 346" />
          <path className="orbit-flow-trace orbit-flow-trace--cyan" d={productsRoute} />
          <path className="orbit-flow-trace orbit-flow-trace--violet" d="M824 138 C1010 333 1214 449 1602 346" />
          <circle cx="1089" cy="383" r="18" className="orbit-node-ring" />
          <circle cx="1089" cy="383" r="6" className="orbit-node orbit-node--cyan" />
          <circle r="5" className="orbit-packet orbit-packet--cyan" filter={`url(#${glowId})`}>
            <animateMotion dur="8s" repeatCount="indefinite" path={productsRoute} />
          </circle>
          <circle r="4" className="orbit-packet orbit-packet--violet" filter={`url(#${glowId})`}>
            <animateMotion dur="10s" begin="-3s" repeatCount="indefinite" path="M824 138 C1010 333 1214 449 1602 346" />
          </circle>
        </g>
      ) : (
        <g className="orbit-home">
          <path className="orbit-line orbit-line--faint" d="M-90 684 C208 408 476 360 710 405 C995 459 1216 453 1482 272" />
          <path className="orbit-line orbit-line--faint" d="M-40 330 C270 323 404 448 676 424 C952 400 1247 290 1604 356" />
          <path className="orbit-line orbit-line--major" stroke={`url(#${gradientId})`} d={homeRoute} />
          <path className="orbit-line orbit-line--cyan" d={homeReturnRoute} />
          <path className="orbit-flow-trace orbit-flow-trace--violet" d={homeRoute} />
          <path className="orbit-flow-trace orbit-flow-trace--cyan" d={homeReturnRoute} />
          <circle cx="76" cy="646" r="21" className="orbit-node-ring orbit-node-ring--violet" />
          <circle cx="76" cy="646" r="6" className="orbit-node orbit-node--violet" filter={`url(#${glowId})`} />
          <circle cx="1528" cy="91" r="18" className="orbit-node-ring" />
          <circle cx="1528" cy="91" r="5" className="orbit-node orbit-node--cyan" filter={`url(#${glowId})`} />
          <circle cx="1452" cy="353" r="12" className="orbit-node-ring" />
          <circle cx="1452" cy="353" r="4" className="orbit-node orbit-node--cyan" />
          <circle r="5" className="orbit-packet orbit-packet--violet" filter={`url(#${glowId})`}>
            <animateMotion dur="10s" repeatCount="indefinite" path={homeRoute} />
          </circle>
          <circle r="4" className="orbit-packet orbit-packet--violet" filter={`url(#${glowId})`}>
            <animateMotion dur="10s" begin="-5s" repeatCount="indefinite" path={homeRoute} />
          </circle>
          <circle r="5" className="orbit-packet orbit-packet--cyan" filter={`url(#${glowId})`}>
            <animateMotion dur="12s" begin="-2s" repeatCount="indefinite" path={homeReturnRoute} />
          </circle>
          <g className="orbit-telemetry" transform="translate(1130 299)">
            <circle cx="0" cy="0" r="3" />
            <text x="22" y="-6">CALLBACK RECEIVED</text>
            <text x="22" y="13">RETRY SUCCEEDED</text>
          </g>
        </g>
      )}
    </svg>
  );
}

export function ProductsHeaderFlow() {
  return (
    <svg
      className="products-header-flow"
      viewBox="0 0 760 360"
      role="img"
      aria-label="Callback events are received and stored while Retry jobs recover outbound requests through backoff"
    >
      <defs>
        <marker id="products-header-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 7 3.5 0 7Z" />
        </marker>
        <filter id="products-header-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g className="products-header-grid">
        {Array.from({ length: 8 }, (_, index) => <path key={`v-${index}`} d={`M${index * 108 + 2} 0V360`} />)}
        {Array.from({ length: 5 }, (_, index) => <path key={`h-${index}`} d={`M0 ${index * 90}H760`} />)}
      </g>

      <text className="products-header-label products-header-label--cyan" x="36" y="38">CALLBACK · INBOUND</text>
      <path className="products-header-rail products-header-rail--cyan" d="M58 112H702" markerEnd="url(#products-header-arrow)" />
      <path className="products-header-trace products-header-trace--cyan" d="M58 112H702" />
      <g className="products-header-node" transform="translate(72 112)"><circle r="24" /><text y="4">POST</text></g>
      <g className="products-header-module products-header-module--cyan" transform="translate(266 112)"><rect x="-70" y="-34" width="140" height="68" rx="8" /><text y="-4">CALLBACK</text><text className="products-header-meta" y="16">public receiver</text></g>
      <g className="products-header-module" transform="translate(478 112)"><rect x="-62" y="-30" width="124" height="60" rx="8" /><text y="-4">STORED</text><text className="products-header-meta" y="16">event ready</text></g>
      <g className="products-header-node products-header-node--terminal" transform="translate(688 112)"><circle r="24" /><path d="M-10 0-3 8 12-10" /></g>
      <circle r="5" className="products-header-packet products-header-packet--cyan" filter="url(#products-header-glow)"><animateMotion dur="5.2s" repeatCount="indefinite" path="M58 112H702" /></circle>

      <text className="products-header-label products-header-label--violet" x="36" y="218">RETRY · OUTBOUND</text>
      <path className="products-header-rail products-header-rail--violet" d="M58 292H702" markerEnd="url(#products-header-arrow)" />
      <path className="products-header-trace products-header-trace--violet" d="M58 292H702" />
      <g className="products-header-node products-header-node--violet" transform="translate(72 292)"><circle r="24" /><text y="4">JOB</text></g>
      <g className="products-header-module products-header-module--error" transform="translate(234 292)"><rect x="-58" y="-30" width="116" height="60" rx="8" /><text y="-4">ATTEMPT 01</text><text className="products-header-error" y="16">HTTP 503</text></g>
      <g className="products-header-clock" transform="translate(400 292)"><circle r="25" /><path d="M0-13V0L10 7" /><text y="48">BACKOFF</text></g>
      <g className="products-header-module products-header-module--success" transform="translate(562 292)"><rect x="-58" y="-30" width="116" height="60" rx="8" /><text y="-4">ATTEMPT 02</text><text className="products-header-success" y="16">HTTP 204</text></g>
      <g className="products-header-node products-header-node--terminal" transform="translate(688 292)"><circle r="24" /><path d="M-10 0-3 8 12-10" /></g>
      <circle r="5" className="products-header-packet products-header-packet--violet" filter="url(#products-header-glow)"><animateMotion dur="6.4s" begin="-2s" repeatCount="indefinite" path="M58 292H702" /></circle>
    </svg>
  );
}

type ProductFlowProps = {
  variant: "callback" | "retry";
};

export function ProductFlow({ variant }: ProductFlowProps) {
  if (variant === "callback") {
    return (
      <svg className="product-flow product-flow--callback" viewBox="0 0 560 156" role="img" aria-label="Callback flow: an upstream service posts an event, Exende stores it, and an agent reads it">
        <defs>
          <marker id="callback-mini-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" /></marker>
        </defs>
        <path className="product-flow__rail" d="M72 78 H488" markerEnd="url(#callback-mini-arrow)" />
        <path className="product-flow__trace" d="M72 78 H488" />
        <g className="product-flow__node" transform="translate(72 78)"><rect x="-50" y="-30" width="100" height="60" rx="7" /><text y="-3">UPSTREAM</text><text className="product-flow__meta" y="16">POST event</text></g>
        <g className="product-flow__node product-flow__node--accent" transform="translate(280 78)"><rect x="-58" y="-38" width="116" height="76" rx="9" /><text y="-5">CALLBACK</text><text className="product-flow__meta" y="16">event stored</text><circle cx="0" cy="-49" r="4" /></g>
        <g className="product-flow__node" transform="translate(488 78)"><rect x="-50" y="-30" width="100" height="60" rx="7" /><text y="-3">AGENT</text><text className="product-flow__meta" y="16">read / wait</text></g>
        <circle r="4" className="product-flow__packet"><animateMotion dur="4.8s" repeatCount="indefinite" path="M72 78 H488" /></circle>
      </svg>
    );
  }

  return (
    <svg className="product-flow product-flow--retry" viewBox="0 0 560 156" role="img" aria-label="Retry flow: a durable job retries a failed request after backoff until it succeeds">
      <defs>
        <marker id="retry-mini-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" /></marker>
      </defs>
      <path className="product-flow__rail" d="M55 78 H500" markerEnd="url(#retry-mini-arrow)" />
      <path className="product-flow__trace" d="M55 78 H500" />
      <g className="product-flow__node product-flow__node--small" transform="translate(55 78)"><circle r="25" /><text y="4">JOB</text></g>
      <g className="product-flow__attempt" transform="translate(188 78)"><rect x="-47" y="-28" width="94" height="56" rx="7" /><text y="-4">ATTEMPT 1</text><text className="product-flow__error" y="16">503</text></g>
      <g className="product-flow__backoff" transform="translate(323 78)"><circle r="24" /><path d="M0-13V0L10 7" /><text y="45">BACKOFF</text></g>
      <g className="product-flow__attempt product-flow__attempt--success" transform="translate(456 78)"><rect x="-47" y="-28" width="94" height="56" rx="7" /><text y="-4">ATTEMPT 2</text><text className="product-flow__success" y="16">204</text></g>
      <circle r="4" className="product-flow__packet"><animateMotion dur="5.2s" repeatCount="indefinite" path="M55 78 H500" /></circle>
    </svg>
  );
}

export function CallbackDiagram() {
  const rows = [82, 244, 406] as const;
  return (
    <svg className="callback-diagram callback-diagram--lanes" viewBox="0 0 900 500" role="img" aria-label="Callback API flow in three steps: create a callback, receive an upstream event, then read the stored event">
      <defs>
        <marker id="callback-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" /></marker>
        <filter id="callback-lane-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {rows.map((y, index) => <path key={y} className="callback-lane-grid" d={`M42 ${y}H858`} data-row={index + 1} />)}
      <g className="callback-lane-step" transform="translate(42 82)"><circle r="19" /><text y="5">01</text></g>
      <g className="callback-lane-step" transform="translate(42 244)"><circle r="19" /><text y="5">02</text></g>
      <g className="callback-lane-step" transform="translate(42 406)"><circle r="19" /><text y="5">03</text></g>

      <g className="callback-lane-node" transform="translate(142 82)"><rect x="-63" y="-34" width="126" height="68" rx="8" /><text y="-3">AGENT</text><text className="callback-lane-meta" y="18">create</text></g>
      <path className="callback-lane-route" d="M206 82H338" markerEnd="url(#callback-arrow)" />
      <g className="callback-lane-action" transform="translate(464 82)"><rect x="-126" y="-39" width="252" height="78" rx="8" /><text y="-7">POST /v1/callbacks</text><text className="callback-lane-meta" y="17">x402 settlement</text></g>
      <path className="callback-lane-route callback-lane-route--return" d="M590 82H696" markerEnd="url(#callback-arrow)" />
      <g className="callback-lane-result" transform="translate(778 82)"><rect x="-82" y="-34" width="164" height="68" rx="8" /><text y="-5">CALLBACK URL</text><text className="callback-lane-meta" y="17">+ read token</text></g>

      <g className="callback-lane-node callback-lane-node--violet" transform="translate(142 244)"><rect x="-63" y="-34" width="126" height="68" rx="8" /><text y="-3">UPSTREAM</text><text className="callback-lane-meta" y="18">event source</text></g>
      <path className="callback-lane-route callback-lane-route--violet" d="M206 244H338" markerEnd="url(#callback-arrow)" />
      <g className="callback-lane-action callback-lane-action--violet" transform="translate(464 244)"><rect x="-126" y="-39" width="252" height="78" rx="8" /><text y="-7">POST /hooks/{`{id}`}</text><text className="callback-lane-meta" y="17">public receiver</text></g>
      <path className="callback-lane-route callback-lane-route--violet" d="M590 244H696" markerEnd="url(#callback-arrow)" />
      <g className="callback-lane-result callback-lane-result--violet" transform="translate(778 244)"><rect x="-82" y="-34" width="164" height="68" rx="8" /><text y="-5">EVENT STORED</text><text className="callback-lane-meta" y="17">up to 256 KB</text></g>

      <g className="callback-lane-node" transform="translate(142 406)"><rect x="-63" y="-34" width="126" height="68" rx="8" /><text y="-3">AGENT</text><text className="callback-lane-meta" y="18">private access</text></g>
      <path className="callback-lane-route" d="M206 406H338" markerEnd="url(#callback-arrow)" />
      <g className="callback-lane-action" transform="translate(464 406)"><rect x="-126" y="-39" width="252" height="78" rx="8" /><text y="-7">GET /wait</text><text className="callback-lane-meta" y="17">read token · up to 30s</text></g>
      <path className="callback-lane-route callback-lane-route--return" d="M590 406H696" markerEnd="url(#callback-arrow)" />
      <g className="callback-lane-result" transform="translate(778 406)"><rect x="-82" y="-34" width="164" height="68" rx="8" /><text y="-5">EVENT BODY</text><text className="callback-lane-meta" y="17">returned once ready</text></g>

      <circle r="5" className="callback-lane-packet" filter="url(#callback-lane-glow)"><animateMotion dur="5s" repeatCount="indefinite" path="M206 82H696" /></circle>
      <circle r="5" className="callback-lane-packet callback-lane-packet--violet" filter="url(#callback-lane-glow)"><animateMotion dur="5.5s" begin="-2.5s" repeatCount="indefinite" path="M206 244H696" /></circle>
      <circle r="5" className="callback-lane-packet" filter="url(#callback-lane-glow)"><animateMotion dur="5.2s" begin="-1.2s" repeatCount="indefinite" path="M206 406H696" /></circle>
    </svg>
  );
}

export function RetryDiagram() {
  return (
    <svg className="retry-diagram" viewBox="0 0 900 390" role="img" aria-label="Retry API flow: an accepted job gets a 503 response, waits through backoff, retries successfully with 204, and records status and attempt history">
      <defs>
        <marker id="retry-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" /></marker>
        <filter id="retry-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path className="retry-diagram__rail" d="M92 154H808" markerEnd="url(#retry-arrow)" />
      <path className="retry-diagram__trace" d="M92 154H808" />
      <g className="retry-diagram__node" transform="translate(92 154)"><circle r="43" /><text y="-3">JOB</text><text className="retry-diagram__meta" y="18">accepted</text></g>
      <g className="retry-diagram__card" transform="translate(276 154)"><rect x="-72" y="-49" width="144" height="98" rx="10" /><text y="-13">ATTEMPT 01</text><text className="retry-diagram__error" y="16">HTTP 503</text><text className="retry-diagram__meta" y="37">retryable</text></g>
      <g className="retry-diagram__clock" transform="translate(450 154)"><circle r="42" /><path d="M0-21V0L16 10" /><text y="72">BACKOFF</text></g>
      <g className="retry-diagram__card retry-diagram__card--success" transform="translate(624 154)"><rect x="-72" y="-49" width="144" height="98" rx="10" /><text y="-13">ATTEMPT 02</text><text className="retry-diagram__success" y="16">HTTP 204</text><text className="retry-diagram__meta" y="37">terminal</text></g>
      <g className="retry-diagram__node retry-diagram__node--success" transform="translate(808 154)"><circle r="43" /><path d="M-17 0-5 13 20-17" /><text y="72">SUCCEEDED</text></g>
      <circle r="6" className="retry-diagram__packet" filter="url(#retry-glow)"><animateMotion dur="6s" repeatCount="indefinite" path="M92 154H808" /></circle>

      <g className="retry-diagram__history" transform="translate(106 300)">
        <rect width="688" height="58" rx="8" />
        <text x="24" y="24">GET /v1/retries/{`{id}`}/attempts</text>
        <text className="retry-diagram__meta" x="24" y="43">status + duration + error code + retry schedule</text>
        <path d="M720 29H760" markerEnd="url(#retry-arrow)" />
      </g>
    </svg>
  );
}

export function PricingGraph() {
  return (
    <svg className="pricing-graph" viewBox="0 0 900 720" role="img" aria-label="Individual Callback and Retry resources moving along pay-as-you-go usage paths">
      <g className="pricing-grid">
        {Array.from({ length: 13 }, (_, index) => <path key={`v-${index}`} d={`M${index * 75} 0V720`} />)}
        {Array.from({ length: 10 }, (_, index) => <path key={`h-${index}`} d={`M0 ${index * 80}H900`} />)}
      </g>
      <g className="pricing-traces">
        <path className="pricing-trace pricing-trace--faint" d="M-80 646 C110 535 236 520 361 410 S605 316 763 135 890 55 968 8" />
        <path className="pricing-trace pricing-trace--faint" d="M-90 675 C98 615 235 592 383 474 S620 375 788 242 902 156 960 123" />
        <path className="pricing-trace pricing-trace--violet" d="M-80 706 C116 656 203 648 351 574 S579 518 742 444 890 381 958 300" />
        <path className="pricing-trace pricing-trace--cyan" d="M-55 660 C62 602 84 619 146 548 S235 540 306 450 397 460 461 371 560 390 622 287 713 310 766 208 855 239 916 100" />
      </g>
      {[146, 306, 461, 622, 766, 916].map((x, index) => (
        <circle key={x} cx={x} cy={[548, 450, 371, 287, 208, 100][index]} r="6" className="pricing-point" style={{ animationDelay: `${index * 280}ms` }} />
      ))}
      <g className="pricing-request" transform="translate(522 304)"><rect x="-44" y="-18" width="88" height="36" rx="5" /><text y="5">RETRY JOB</text></g>
      <g className="pricing-request pricing-request--violet" transform="translate(747 166)"><rect x="-48" y="-18" width="96" height="36" rx="5" /><text y="5">CALLBACK</text></g>
      <g className="pricing-request" transform="translate(858 62)"><rect x="-44" y="-18" width="88" height="36" rx="5" /><text y="5">SETTLED</text></g>
    </svg>
  );
}
