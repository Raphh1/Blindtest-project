// components/ui/Card.tsx
"use client";

import React from "react";
import classNames from "classnames";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={classNames("bg-zinc-800 p-6 rounded-lg", className)} {...props}>
      {children}
    </div>
  );
};