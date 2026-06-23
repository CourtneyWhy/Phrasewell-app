import { BottomNavGate } from "@/app/components/BottomNavGate";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      className="app-shell"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        maxWidth: 430,
        background: "var(--bg)",
        position: "relative",
      }}
    >
      <main
        style={{
          flex: 1,
          minHeight: 0,
          paddingLeft: "var(--space-3)",
          paddingRight: "var(--space-3)",
          position: "relative",
        }}
      >
        {children}
      </main>
      <BottomNavGate />
    </div>
  );
}
