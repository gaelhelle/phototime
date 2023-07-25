import Image from "next/image";

export default function Logo() {
  return (
    <div className="mx-auto text-center pb-20">
      <Image src="/phototime-logo.svg" alt="PhotoTime Logo" width={200} height={24} priority className="mx-auto" />
    </div>
  );
}
