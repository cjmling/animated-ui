import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Line } from "react-native-svg";

const AnimatedLine = Animated.createAnimatedComponent(Line);

interface CircularClockProps {
  hour: number; // 0-23
  minute: number; // 0-59
  size?: number;
}

export const CircularClock: React.FC<CircularClockProps> = ({
  hour,
  minute,
  size = 240,
}) => {
  const center = size / 2;
  const radius = size / 2 - 16;

  // Calculate angles
  const minuteAngle = useSharedValue((minute / 60) * 360);
  const hourAngle = useSharedValue(
    ((hour % 12) / 12) * 360 + (minute / 60) * 30
  );

  useEffect(() => {
    minuteAngle.value = withTiming((minute / 60) * 360, { duration: 500 });
    hourAngle.value = withTiming(
      ((hour % 12) / 12) * 360 + (minute / 60) * 30,
      { duration: 500 }
    );
  }, [hour, minute]);

  const minuteArmLength = radius - 16;
  const hourArmLength = radius - 40;

  const minuteAnimatedProps = useAnimatedProps(() => {
    const angleRad = (minuteAngle.value - 90) * (Math.PI / 180);
    return {
      x2: String(center + minuteArmLength * Math.cos(angleRad)),
      y2: String(center + minuteArmLength * Math.sin(angleRad)),
    };
  });

  const hourAnimatedProps = useAnimatedProps(() => {
    const angleRad = (hourAngle.value - 90) * (Math.PI / 180);
    return {
      x2: String(center + hourArmLength * Math.cos(angleRad)),
      y2: String(center + hourArmLength * Math.sin(angleRad)),
    };
  });

  // Dashes
  const dashes = Array.from({ length: 60 }).map((_, i) => {
    const angle = (i * 6 - 90) * (Math.PI / 180);
    const dashLength = i % 5 === 0 ? 12 : 8;
    const x1 = center + (radius - dashLength) * Math.cos(angle);
    const y1 = center + (radius - dashLength) * Math.sin(angle);
    const x2 = center + radius * Math.cos(angle);
    const y2 = center + radius * Math.sin(angle);
    return (
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={i % 5 === 0 ? "#222" : "#222"}
        strokeWidth={i % 5 === 0 ? 3 : 1.5}
        strokeLinecap="round"
      />
    );
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#222"
          strokeWidth={6}
          fill="#fff"
        />
        {dashes}
        {/* Hour arm */}
        <AnimatedLine
          x1={center}
          y1={center}
          animatedProps={hourAnimatedProps}
          stroke="#222"
          strokeWidth={6}
          strokeLinecap="round"
        />
        {/* Minute arm */}
        <AnimatedLine
          x1={center}
          y1={center}
          animatedProps={minuteAnimatedProps}
          stroke="#222"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Center dot */}
        <Circle cx={center} cy={center} r={8} fill="#222" />
      </Svg>
    </View>
  );
};
