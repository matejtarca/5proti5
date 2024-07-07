export default function ErrorCircle({
  isLarge = false,
}: {
  isLarge?: boolean;
}) {
  return (
    <img
      src="/5proti5-error.png"
      className={isLarge ? "w-[200px] h-[200px]" : "w-[50px] h-[50px]"}
    />
  );
}
