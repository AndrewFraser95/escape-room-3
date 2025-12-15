const ChristmasLights = () => {
  const lights = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    color:
      i % 4 === 0
        ? "bg-christmas-red"
        : i % 4 === 1
        ? "bg-christmas-green"
        : i % 4 === 2
        ? "bg-christmas-gold"
        : "bg-blue-400",
    delay: i * 0.2,
  }));

  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex justify-center">
      <div className="flex gap-8 py-2">
        {lights.map((light) => (
          <div
            key={light.id}
            className={`w-3 h-4 rounded-full ${light.color} animate-twinkle`}
            style={{
              animationDelay: `${light.delay}s`,
              boxShadow: `0 0 10px currentColor, 0 0 20px currentColor`,
            }}
          />
        ))}
      </div>
      <svg className="absolute top-0 w-full h-4" preserveAspectRatio="none">
        <path
          d="M0,8 Q50,15 100,8 Q150,1 200,8 Q250,15 300,8 Q350,1 400,8 Q450,15 500,8 Q550,1 600,8 Q650,15 700,8 Q750,1 800,8 Q850,15 900,8 Q950,1 1000,8 Q1050,15 1100,8 Q1150,1 1200,8 Q1250,15 1300,8 Q1350,1 1400,8"
          stroke="hsl(var(--christmas-green))"
          strokeWidth="2"
          fill="none"
          className="w-full"
        />
      </svg>
    </div>
  );
};

export default ChristmasLights;
