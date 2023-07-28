import JoinRoom from "@/components/join-room";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 bg-[#292F34] text-white">
      <div className="container mx-auto">
        <div className="text-center">
          <Logo />
        </div>
        <JoinRoom />
      </div>
    </main>
  );
}
