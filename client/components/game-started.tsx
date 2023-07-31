import { useContext, useRef, useState } from "react";
import ReactSlider from "react-slider";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { SocketContext } from "@/providers/SocketProvider";

interface GameStartedProps {}

export default function GameStarted(props: GameStartedProps | any) {
  const { photos, settings } = props.data;
  const { socket } = useContext(SocketContext);

  const defaultSliderValue = Math.round((Number(process.env.NEXT_PUBLIC_GAME_MIN_YEAR) + Number(process.env.NEXT_PUBLIC_GAME_MAX_YEAR)) / 2);
  const [sliderValue, setSliderValue] = useState(defaultSliderValue);
  const [current, setCurrent] = useState(0);
  const [scale, setScale] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    socket.emit("game:send-answer", sliderValue);
    setScale(0);
    setCurrent((state) => state + 1);
    setSliderValue(defaultSliderValue);
  };

  if (current > settings?.max - 1) {
    return <div>Game finished</div>;
  }

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  const handleOnImageLoad = (e: any) => {
    if (e.target && divRef.current) {
      const { width: imageWidth, height: imageHeight } = e.target;
      const { clientWidth: divWidth, clientHeight: divHeight } = divRef.current;
      const imageRatio = Math.min(divWidth / imageWidth, divHeight / imageHeight);
      setScale(imageRatio);
    }
  };

  return (
    <div className="flex w-full flex-col self-start">
      <h3 className="font-medium text-center mb-4 -mt-4">
        Round {current + 1} of {settings?.max}
      </h3>
      <div className="w-full h-[500px] relative overflow-hidden mb-20">
        <div ref={divRef} className="h-full w-full">
          {scale ? (
            <TransformWrapper initialScale={scale} minScale={scale} key={photos.url} centerOnInit>
              <TransformComponent wrapperClass="!w-full !h-full bg-gray-400/40" contentClass="w-full">
                <img src={photos[current].url} alt="Guess the year" className="w-full max-w-none" />
              </TransformComponent>
            </TransformWrapper>
          ) : null}
          <img src={photos[current].url} onLoad={handleOnImageLoad} alt="Guess the year" className="invisible pointer-events-none" />
        </div>
      </div>

      <ReactSlider
        className="horizontal-slider"
        value={sliderValue}
        onChange={handleSliderChange}
        min={Number(process.env.NEXT_PUBLIC_GAME_MIN_YEAR)}
        max={Number(process.env.NEXT_PUBLIC_GAME_MAX_YEAR)}
        marks={1}
        markClassName="example-mark"
        renderMark={(props) => {
          const leftPosition = ((Number(process.env.NEXT_PUBLIC_GAME_MIN_YEAR) + Number(props.key) - Number(process.env.NEXT_PUBLIC_GAME_MIN_YEAR)) / (Number(process.env.NEXT_PUBLIC_GAME_MAX_YEAR) - Number(process.env.NEXT_PUBLIC_GAME_MIN_YEAR))) * 92 + "%";

          props.style = {
            left: leftPosition,
          };
          return <span {...props} />;
        }}
        thumbClassName="example-thumb"
        trackClassName="example-track"
        renderThumb={(props, state) => (
          <div {...props}>
            <span>{state.valueNow}</span>
            <span className="example-thumb-indicator" />
          </div>
        )}
      />
      <br />
      <div className="text-center mt-6">
        <button className="bg-primary px-10 py-4 rounded text-center font-semibold  mx-auto cursor-pointer disabled:bg-gray-500 disabled:cursor-default hover:opacity-80 active:scale-95 transition-all" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
