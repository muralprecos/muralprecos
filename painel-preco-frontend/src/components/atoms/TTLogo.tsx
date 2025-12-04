import * as React from "react";

export const TTLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    width="1000"
    height="1000"
    viewBox="0 0 1000 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="1000"
      height="1000"
      rx="500"
      fill="url(#paint0_linear_163_2)"
    />
    <mask
      id="mask0_163_2"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="194"
      y="194"
      width="612"
      height="612"
    >
      <path
        d="M194 204C194 198.477 198.477 194 204 194H796C801.523 194 806 198.477 806 204V796C806 801.523 801.523 806 796 806H204C198.477 806 194 801.523 194 796V204Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask0_163_2)">
      <mask
        id="mask1_163_2"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="194"
        y="194"
        width="612"
        height="612"
      ></mask>
      <g mask="url(#mask1_163_2)">
        <path
          d="M194 444C194 305.929 305.929 194 444 194H556C694.071 194 806 305.929 806 444V556C806 694.071 694.071 806 556 806H444C305.929 806 194 694.071 194 556V444Z"
          fill="white"
        />
      </g>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_163_2"
        x1="957.099"
        y1="1000"
        x2="-29.8342"
        y2="60.3183"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#6D0AD8" />
        <stop offset="0.467152" stopColor="#771AE6" />
        <stop offset="0.971049" stopColor="#3F13A1" />
      </linearGradient>
    </defs>
  </svg>
);
