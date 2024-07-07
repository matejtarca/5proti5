import ErrorCircle from "./ErrorCircle";

export default function ScoreBox({
  score,
  errors,
  errorsReversed,
  teamName,
  teamOnTurn,
}: {
  score: number;
  errors?: number;
  errorsReversed?: boolean;
  teamName?: string;
  teamOnTurn?: boolean;
}) {
  return (
    <>
      {errors !== undefined ? (
        <div
          className={`flex w-full justify-start gap-4 ${
            errorsReversed ? "flex-row-reverse pr-2" : "flex-row pl-2"
          }`}
        >
          {errors > 0 ? (
            Array(errors)
              .fill(0)
              .map((_, i) => <ErrorCircle key={i} />)
          ) : (
            <div className="h-[50px]"></div>
          )}
        </div>
      ) : null}
      <div
        className="bg-orange-400 text-white w-[200px] text-center text-7xl score-box"
        style={{ textShadow: "1px 1px 2px black" }}
      >
        {score}
      </div>
      {teamName && (
        <div
          className={`${teamOnTurn ? "text-[#E89939]" : "text-white"} text-3xl`}
          style={{ textShadow: "1px 1px 2px black" }}
        >
          {teamName}
        </div>
      )}
    </>
  );
}
