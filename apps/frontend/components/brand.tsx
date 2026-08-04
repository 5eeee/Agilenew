import Link from "next/link";
import Image from "next/image";

export function Brand({ href }: { href: string }) {
  return (
    <Link className="brand" href={href} aria-label="Agile Business">
      <Image className="brand-logo" src="/brand-logo.png" alt="" width={58} height={48} priority />
    </Link>
  );
}
