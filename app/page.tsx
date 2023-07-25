import JoinRoom from "@/components/join-room";
import Logo from "@/components/logo";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 bg-[#292F34] text-white">
      <div className="container mx-auto">
        <Logo />
        <JoinRoom />
      </div>
    </main>
  );
}
