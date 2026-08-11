type ContainerProp = {
  children: React.ReactNode;
};
export default function DarkCard({ children }: ContainerProp) {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
      <CornerNode position="top-left" />
      <CornerNode position="top-right" />
      <CornerNode position="bottom-left" />
      <CornerNode position="bottom-right" />
      <div className="relative z-10 w-full max-w-[340px] rounded-2xl border border-white/10 bg-[#111113] px-7 py-8 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="h-11 w-11 rounded-xl bg-[#1c1c1f] border border-white/10 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-sky-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M12 3a9 9 0 1 0 9 9" />
            </svg>
          </div>
        </div>
         {children}
      </div>
    </div>
  );
}
function CornerNode({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("left");

  return (
    <div
      className={`hidden sm:block absolute ${isTop ? "top-16" : "bottom-16"} ${
        isLeft ? "left-8" : "right-8"
      } opacity-40`}
    >
      <div
        className={`h-9 w-16 rounded-md bg-[#151517] border border-white/10 ${
          isLeft ? "" : "ml-auto"
        }`}
      />
    </div>
  );
}