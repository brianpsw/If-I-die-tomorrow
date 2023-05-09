import { Navigation } from "../ui/Navigation";

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode;
  }) {
    const navLinks = [{href: "/content/bucket", name: "bucket"}, {href: "/content/photo", name: "photo"}, {href: "/content/diary", name: "diary"}, {href: "/content/will", name: "will"}];
    return (
      <section>
        <Navigation navLinks={navLinks}/>
        {children}
      </section>
    );
  }
