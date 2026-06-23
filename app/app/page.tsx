import { HomeContent } from "@/app/app/HomeContent";

export default function AppHome() {
  return (
    <main
      className="home-page"
      style={{
        paddingBottom: 100,
        paddingLeft: "var(--space-4)",
        paddingRight: "var(--space-4)",
        maxWidth: 760,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <HomeContent />
    </main>
  );
}
