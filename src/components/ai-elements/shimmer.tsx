"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties, ElementType } from "react";
import { createElement, memo } from "react";

export interface TextShimmerProps {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

const ShimmerComponent = ({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) => {
  const dynamicSpread = children.length * spread;

  return createElement(
    Component,
    {
      className: cn(
        "nexora-text-shimmer relative inline-block bg-clip-text text-transparent",
        className
      ),
      style: {
        "--shimmer-spread": `${dynamicSpread}px`,
        "--shimmer-duration": `${duration}s`,
      } as CSSProperties,
    },
    children
  );
};

export const Shimmer = memo(ShimmerComponent);
