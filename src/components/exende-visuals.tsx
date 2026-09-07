import Image from "next/image";

const sceneAssets = {
  home: "/media/exende-home-infrastructure-v2.png",
  products: "/media/exende-products-workflows-v2.png",
  docs: "/media/exende-docs-contracts.png",
  pricing: "/media/exende-pricing-x402-v2.png",
  callback: "/media/exende-callback-flow.png",
  retry: "/media/exende-retry-flow.png",
  resolve: "/media/exende-resolve-flow.png",
} as const;

type StaticSceneProps = {
  src: string;
  className?: string;
  sizes: string;
  preload?: boolean;
  objectPosition?: string;
};

function StaticScene({
  src,
  className = "",
  sizes,
  preload = false,
  objectPosition = "center",
}: StaticSceneProps) {
  return (
    <div className={`static-scene ${className}`} aria-hidden="true">
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        loading={preload ? "eager" : undefined}
        draggable={false}
        className="static-scene__image"
        style={{ objectPosition }}
      />
    </div>
  );
}

type OrbitFieldProps = {
  variant?: "home" | "products";
  className?: string;
};

export function OrbitField({ variant = "home", className = "" }: OrbitFieldProps) {
  return (
    <StaticScene
      src={sceneAssets.home}
      className={`static-scene--orbit static-scene--orbit-${variant} ${className}`}
      sizes="100vw"
      preload={variant === "home"}
    />
  );
}

export function ProductsHeaderFlow() {
  return (
    <StaticScene
      src={sceneAssets.products}
      className="static-scene--products"
      sizes="100vw"
      preload
    />
  );
}

export function DocsContractScene() {
  return <StaticScene src={sceneAssets.docs} className="static-scene--docs" sizes="(max-width: 899px) 1px, 100vw" preload />;
}

export function PricingGraph() {
  return (
    <StaticScene
      src={sceneAssets.pricing}
      className="static-scene--pricing"
      sizes="100vw"
      preload
    />
  );
}

export function CallbackDiagram() {
  return (
    <StaticScene
      src={sceneAssets.callback}
      className="static-scene--product"
      sizes="(max-width: 1023px) 100vw, 58vw"
      preload
    />
  );
}

export function RetryDiagram() {
  return (
    <StaticScene
      src={sceneAssets.retry}
      className="static-scene--product"
      sizes="(max-width: 1023px) 100vw, 58vw"
      preload
    />
  );
}

export function ResolveDiagram() {
  return (
    <StaticScene
      src={sceneAssets.resolve}
      className="static-scene--product"
      sizes="(max-width: 1023px) 100vw, 58vw"
      preload
    />
  );
}

type ProductFlowProps = {
  variant: "callback" | "retry" | "resolve";
};

export function ProductFlow({ variant }: ProductFlowProps) {
  const assets = {
    callback: sceneAssets.callback,
    retry: sceneAssets.retry,
    resolve: sceneAssets.resolve,
  } as const;

  return (
    <StaticScene
      src={assets[variant]}
      className="static-scene--product-crop"
      sizes="(max-width: 899px) 100vw, 36vw"
    />
  );
}
