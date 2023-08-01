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
    socket.emit("room:send-answer", sliderValue);
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
      <div>
        <div className="inline-block">
          <div className="bg-black/40 rounded-lg gap-2 flex items-center w-auto px-2.5 py-2 -mt-8 -mb-1 text-xs text-white/80">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
              </svg>
            </span>
            <span>You can scroll to zoom the picture</span>
          </div>
        </div>
      </div>
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

      <div className="mt-2 mb-10">
        <ReactSlider
          className="horizontal-slider"
          value={sliderValue}
          onChange={handleSliderChange}
          min={Number(process.env.NEXT_PUBLIC_GAME_MIN_YEAR)}
          max={Number(process.env.NEXT_PUBLIC_GAME_MAX_YEAR)}
          marks={1}
          renderMark={(props) => {
            const leftPosition = ((Number(process.env.NEXT_PUBLIC_GAME_MIN_YEAR) + Number(props.key) - Number(process.env.NEXT_PUBLIC_GAME_MIN_YEAR)) / (Number(process.env.NEXT_PUBLIC_GAME_MAX_YEAR) - Number(process.env.NEXT_PUBLIC_GAME_MIN_YEAR))) * 92 + "%";
            const style = {
              left: leftPosition,
            };
            return <span key={props.key} style={style} className="example-mark" />;
          }}
          thumbClassName="example-thumb"
          trackClassName="example-track"
          renderThumb={(props, state) => {
            const key = props.key;
            delete props["key"];
            return (
              <div key={key} {...props} className="example-thumb">
                <span>{state.valueNow}</span>
                <span className="example-thumb-indicator" />
                <span className="example-thumb-arrows">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </span>
              </div>
            );
          }}
        />
      </div>

      <div className="text-center mt-6">
        <button className="border-primary border-2 text-primary px-12 py-3 rounded-lg text-center font-semibold  mx-auto cursor-pointer disabled:bg-gray-500 disabled:cursor-default hover:opacity-80 active:scale-95 transition-all" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
