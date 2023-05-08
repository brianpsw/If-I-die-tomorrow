import { Navigation } from "../ui/Navigation";

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode;
  }) {
    const navLinks = ["/bucket", "/photo"];
    return (
      <section>
        {/* <Navigation navLinks={navLinks}/> */}
        {children}
      </section>
    );
  }