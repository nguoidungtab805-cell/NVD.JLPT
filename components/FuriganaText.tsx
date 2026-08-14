"use client";
import React from "react";

type Props = {
  kanji: string;
  furigana?: string;
  className?: string;
};

export default function FuriganaText({ kanji, furigana, className }: Props) {
  // Uses <ruby> for correct semantics
  return (
    <ruby className={className}>
      {kanji}
      {furigana ? <rt style={{ fontSize: "0.6em" }}>{furigana}</rt> : null}
    </ruby>
  );
}
