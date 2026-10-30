import React, { Fragment } from "react";
import { ReactSVG } from "react-svg";
import classNames from "classnames";

export type IconProps = {
  file: string;
  color?: string;
  wrapper?: "span" | "div";
  className?: string;
  isCursorPointer?: boolean;
  width?: number;
  height?: number;
} & React.AllHTMLAttributes<HTMLElement>;
export type IconPropsChild = Omit<IconProps, "file" | "color">;
const Icon: React.FC<IconProps> = ({
  file,
  color,
  className,
  width = 24,
  height = 24,
  wrapper = "div",
  isCursorPointer = true,
  ...opts
}) => {
  const wrapperClassName = classNames(className, {
    "cursor-pointer": isCursorPointer,
  });

  const content = (
    <Fragment>
      <ReactSVG
        src={`/${file}`}
        wrapper={wrapper}
        className=""
        beforeInjection={(svg) => {
          svg.setAttribute("width", width.toString());
          svg.setAttribute("height", height.toString());

          const classes = className?.split(" ") || [];

          const svgClasses = classes
            .filter((c) => c.startsWith("data-svg:"))
            .map((c) => c.replace("data-svg:", ""));
          const pathClasses = classes
            .filter((c) => c.startsWith("data-path:"))
            .map((c) => c.replace("data-path:", ""));
          const circleClasses = classes
            .filter((c) => c.startsWith("data-circle:"))
            .map((c) => c.replace("data-circle:", ""));

          svgClasses.forEach((cls) => svg.classList.add(cls));

          svg
            .querySelectorAll("path")
            .forEach((el) =>
              pathClasses.forEach((cls) => el.classList.add(cls))
            );

          svg
            .querySelectorAll("circle")
            .forEach((el) =>
              circleClasses.forEach((cls) => el.classList.add(cls))
            );
        }}
        useRequestCache={true}
      />
    </Fragment>
  );

  return wrapper === "span" ? (
    <span className={wrapperClassName} {...opts}>
      {content}
    </span>
  ) : (
    <div className={wrapperClassName} {...opts}>
      {content}
    </div>
  );
};

export default Icon;
