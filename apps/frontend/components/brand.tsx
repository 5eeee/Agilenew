import Link from "next/link";
import Image from "next/image";

export function Brand({ href }: { href: string }) {
  return (
    <Link className="brand" href={href} aria-label="Agile Business">
      <Image className="brand-logo" src="/brand-logo.png" alt="" width={460} height={285} sizes="(max-width: 760px) 184px, 248px" priority />
    </Link>
  );
}
