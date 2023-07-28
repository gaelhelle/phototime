import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="pb-20">
      <Link href="/">
        <Image src="/phototime-logo.svg" alt="PhotoTime Logo" width={200} height={24} priority className="mx-auto" />
      </Link>
    </div>
  );
}
