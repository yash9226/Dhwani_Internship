export function AuroraBackground({ dense = false }: { dense?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.45] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="animate-aurora absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-primary/25 blur-[120px]" />
      <div className="animate-aurora absolute -right-32 top-10 h-[32rem] w-[32rem] rounded-full bg-indigo/25 blur-[130px] [animation-delay:-6s]" />
      {dense && (
        <div className="animate-aurora absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-cyan/20 blur-[130px] [animation-delay:-12s]" />
      )}
      <Particles />
    </div>
  );
}

const dots = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 61) % 100,
  size: 1 + (i % 3),
  delay: (i % 9) * 0.7,
  duration: 6 + (i % 5),
}));

function Particles() {
  return (
    <div className="absolute inset-0">
      {dots.map((d, i) => (
        <span
          key={i}
          className="animate-float absolute rounded-full bg-foreground/25"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
