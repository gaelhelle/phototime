import { useEffect, useState } from "react";
import ReactSlider from "react-slider";

interface GameStartedProps {}

export default function GameStarted(props: GameStartedProps | any) {
  const { photos, settings } = props.data;

  const [current, setCurrent] = useState(0);

  const handleSubmit = () => {
    setCurrent((state) => state + 1);
  };

  useEffect(() => {}, []);

  if (current > 4) {
    return <div>Game finished</div>;
  }

  return (
    <div>
      {photos.map(
        (photo: any, index: number) =>
          index === current && (
            <div key={photo.url} className="max-w-[500px] mx-auto">
              <img src={photo.url} alt="Guess the year" />
            </div>
          )
      )}
      <br />
      <ReactSlider
        className="horizontal-slider"
        min={1900}
        max={2023}
        defaultValue={1961}
        marks={1}
        markClassName="example-mark"
        renderMark={(props) => {
          const leftPosition = ((1900 + Number(props.key) - 1900) / (2023 - 1900)) * 98 + "%";

          props.style = {
            left: leftPosition,
          };
          return <span {...props} />;
        }}
        thumbClassName="example-thumb"
        trackClassName="example-track"
        renderThumb={(props, state) => <span {...props}>{state.valueNow}</span>}
      />
      <br />
      <button className="bg-primary px-10 py-4 rounded text-center font-semibold w-full cursor-pointer disabled:bg-gray-500 disabled:cursor-default" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
