import JoinRoom from "@/components/join-room";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12 pb-24">
      <div className="container mx-auto">
        <div className="text-center">
          <Logo />
        </div>
        <JoinRoom />
      </div>
    </main>
  );
}
