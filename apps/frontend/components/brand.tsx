import Link from "next/link";
import Image from "next/image";

export function Brand({ href }: { href: string }) {
  return (
    <Link className="brand" href={href} aria-label="Agile Business">
      <Image className="brand-logo" src="/brand-signature.svg" alt="" width={442} height={274} sizes="(max-width: 760px) 118px, 248px" priority />
    </Link>
  );
}
