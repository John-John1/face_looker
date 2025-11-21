import { useState, useEffect } from "react";
export default function useGazeTracking() {
  const [imageSrc, setImageSrc] = useState("");
  const [mapping, setMapping] = useState({});
  useEffect(() => {
    async function loadCSV() {
      const res = await fetch("/faces/index.csv");
      const text = await res.text();
      const lines = text.split("\n").slice(1); // 跳过 header
      const map = {};
      for (const line of lines) {
        if (!line.trim()) continue;
        const [filename, px, py] = line.split(",");
        map[filename.trim()] = {
          x: parseFloat(px),
          y: parseFloat(py),
        };
      
      setMapping(map);
    }
    loadCSV();
  }, []);
  function quantize(value) {
    const levels = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];
    let best = levels[0];
    let minDist = Infinity;
    for (const lv of levels) {
      const dist = Math.abs(value - lv);
      if (dist < minDist) {
        minDist = dist;
        best = lv;
      }
    }
    return best;
  }
  function onMove(e) {
    if (!Object.keys(mapping).length) return;

    const xNorm = (e.clientX / window.innerWidth) * 2 - 1; // -1 ~ 1
    const yNorm = (e.clientY / window.innerHeight) * 2 - 1;

    const px = quantize(xNorm * 15);
    const py = quantize(yNorm * 15);
    let bestFile = null;
    let bestDist = Infinity;
    for (const [file, { x, y }] of Object.entries(mapping)) {
      const d = Math.hypot(x - px, y - py);
      if (d < bestDist) {
        bestDist = d;
        bestFile = file;
      }
    }
    if (bestFile) {
      setImageSrc(`/faces/${bestFile}`);
    }
  }
  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  });
  return imageSrc;
}
