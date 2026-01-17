import React from "react";
import { View } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Circle } from "react-native-svg";

interface BlueGlowProps {
  width?: number;
  height?: number;
  intensity?: number; // 0-1, default 0.6
  blur?: number; // Intensità della sfumatura, default 0.2
}

export default function BlueGlow({
  width = 300,
  height = 300,
  intensity = 0.6,
  blur = 0.2,
}: BlueGlowProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  const viewBox = `0 0 ${width} ${height}`;

  return (
    <View
      className="absolute items-center justify-center pointer-events-none"
      style={{ width, height, left: -width / 2 + 22, top: -height / 2 + 22 }}
    >
      {/* Svg Container */}
      <Svg height={height} width={width} viewBox={viewBox}>
        <Defs>
          {/* Definizione del Gradiente Radiale */}
          <RadialGradient
            id={`blueGlow-${width}-${height}`}
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
            fx="50%"
            fy="50%"
            gradientUnits="userSpaceOnUse"
          >
            {/* Stop 0%: Centro (Blu acceso) */}
            <Stop offset="0" stopColor="#135bec" stopOpacity={intensity} />

            {/* Stop 50%: Metà strada (Inizia a sfumare) */}
            <Stop offset="0.5" stopColor="#135bec" stopOpacity={blur} />

            {/* Stop 100%: Bordo (Completamente trasparente) */}
            <Stop offset="1" stopColor="#135bec" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Cerchio che usa il gradiente definito sopra */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill={`url(#blueGlow-${width}-${height})`}
        />
      </Svg>
    </View>
  );
}
