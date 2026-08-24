import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <Link href="/" className={`brand-mark ${className}`} aria-label="Exende home">
      <Image
        src="/exende-logo.svg"
        alt="Exende"
        width={263}
        height={28}
        priority
        className="brand-mark__image"
      />
    </Link>
  );
}
