import { AuthService } from "@/features/authentication/auth-service";
import { DemoBanner } from "@/components/common/DemoBanner";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await AuthService.getCurrentSession();

  return (
    <>
      <DemoBanner />
      <Navbar session={session} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
