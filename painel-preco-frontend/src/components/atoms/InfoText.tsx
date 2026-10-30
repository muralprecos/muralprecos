"use client";

import React from "react";

type InfoTextProps = {
  label: string;
  orientation?: "col" | "row";
  children: React.ReactNode;
} & React.AllHTMLAttributes<HTMLDivElement>;

const InfoText: React.FC<InfoTextProps> = ({
  children,
  orientation = "col",
  label,
  className = "",
  ...opts
}) => {
  return (
    <div
      className={`flex w-full flex-wrap md:flex-nowrap gap-2 py-2 flex-${orientation} ${className}`}
      {...opts}
    >
      <label className="text-sm font-bold text-primary flex flex-row items-center justify-start min-w-fit">
        {label}:
      </label>
      <div className="flex flex-row items-center justify-start text-sm text-foreground">
        {children}
      </div>
    </div>
  );
};

export default InfoText;
