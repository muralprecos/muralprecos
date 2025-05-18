import { useEffect, useState } from "react";

type WidthSkeleton = {
  width: string;
  key: number;
}

export default function SkeletonAnimated({lines = 3, interval = 750, text} : {lines?: number, interval?: number, text?: string}) {
  const possibleWidths = ["w-1/2", "w-3/4", "w-full", "w-1/4", "w-1/3", "w-2/3", "w-1/5", "w-1/6", "w-4/5" ];
  const [widths, setWidths] = useState<WidthSkeleton[]>([]);

  useEffect(() => {
    const intervalFn = setInterval(() => {
      setWidths((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        const randomIndex = Math.floor(Math.random() * possibleWidths.length);
        const newWidths : WidthSkeleton[] = prev.map((item, i) =>
          i === idx ? { 
            ...item,
            width: possibleWidths[randomIndex]
          } : item
        );
        return newWidths;
      });
    }, interval);

    //initial widths
    const initList : WidthSkeleton[] = [];
    for (let i = 0; i < lines; i++) {
      initList.push({ width: possibleWidths[Math.floor(Math.random() * possibleWidths.length)], key: i });
    }
    setWidths(initList);

    return () => clearInterval(intervalFn);
  }, []);

  return (
    <div className="w-full flex items-center space-y-1 my-2 animate-pulse">
      { text != null && (
        <div className="text-sm text-gray-600 font-semibold whitespace-nowrap mr-2">
          {text}
        </div>
      )}
      <div className="flex-1 space-y-1">
        {widths.map((w) => (
          <div key={'idx'+w.key}
            className={`h-1 bg-gray-300 rounded transition-all duration-700 ease-in-out ${w.width}`}
          />
        ))}
      </div>
    </div>
  );
}