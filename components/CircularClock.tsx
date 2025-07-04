import React, { useEffect, useRef } from "react";
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
  backgroundColor?: string;
  lineColor?: string;
  armColor?: string;
  hideCircleBorder?: boolean;
  hideMinuteDashes?: boolean;
  dashSpacingFromBorder?: number;
}

export const CircularClock: React.FC<CircularClockProps> = ({
  hour,
  minute,
  size = 240,
  backgroundColor = "#fff",
  lineColor = "#222",
  armColor = "#fff",
  hideCircleBorder = false,
  hideMinuteDashes = false,
  dashSpacingFromBorder = 16,
}) => {
  const center = size / 2;
  const radius = size / 2 - 16;
  const circleStrokeWidth = 2;
  const minuteArmLength = radius - 20;
  const hourArmLength = radius - 30;

  const minuteArmWidth = size / 80;
  const hourArmWidth = size / 40;

  const hourDashWidth = 2;
  const minuteDashWidth = 1.5;

  const hourDashLength = 6;
  const minuteDashLength = hourDashLength / 2;

  // Calculate angles
  const minuteAngle = useSharedValue((minute / 60) * 360);
  const hourAngle = useSharedValue(
    ((hour % 12) / 12) * 360 + (minute / 60) * 30
  );

  // Track previous values
  const prevMinuteRef = useRef(minute);
  const prevHourRef = useRef(hour);

  useEffect(() => {
    // --- MINUTE ARM ---
    const prevMinute = prevMinuteRef.current;
    let newMinuteAngle = (minute / 60) * 360;
    let prevMinuteAngle = (prevMinute / 60) * 360;
    let minDiff = newMinuteAngle - prevMinuteAngle;
    // Handle wrap-around (e.g., 59 -> 0 or 0 -> 59)
    if (minDiff > 180) minDiff -= 360;
    if (minDiff < -180) minDiff += 360;
    const targetMinuteAngle = minuteAngle.value + minDiff;
    minuteAngle.value = withTiming(targetMinuteAngle, { duration: 500 }, () => {
      // After animation, snap to the correct angle (in case of wrap-around)
      minuteAngle.value = newMinuteAngle;
    });
    prevMinuteRef.current = minute;

    // --- HOUR ARM ---
    const prevHour = prevHourRef.current;
    let newHourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;
    let prevHourAngle = ((prevHour % 12) / 12) * 360 + (prevMinute / 60) * 30;
    let hourDiff = newHourAngle - prevHourAngle;
    if (hourDiff > 180) hourDiff -= 360;
    if (hourDiff < -180) hourDiff += 360;
    const targetHourAngle = hourAngle.value + hourDiff;
    hourAngle.value = withTiming(targetHourAngle, { duration: 500 }, () => {
      hourAngle.value = newHourAngle;
    });
    prevHourRef.current = hour;
  }, [hour, minute]);

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
    const dashLength = i % 5 === 0 ? hourDashLength : minuteDashLength;
    const x1 =
      center + (radius - dashSpacingFromBorder - dashLength) * Math.cos(angle);
    const y1 =
      center + (radius - dashSpacingFromBorder - dashLength) * Math.sin(angle);
    const x2 = center + (radius - dashSpacingFromBorder) * Math.cos(angle);
    const y2 = center + (radius - dashSpacingFromBorder) * Math.sin(angle);
    return (
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={
          i % 5 === 0 ? lineColor : hideMinuteDashes ? "transparent" : lineColor
        }
        strokeWidth={i % 5 === 0 ? hourDashWidth : minuteDashWidth}
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
          stroke={hideCircleBorder ? "transparent" : lineColor}
          strokeWidth={circleStrokeWidth}
          fill={backgroundColor}
        />
        {dashes}
        {/* Hour arm */}
        <AnimatedLine
          x1={center}
          y1={center}
          animatedProps={hourAnimatedProps}
          stroke={armColor}
          strokeWidth={hourArmWidth}
          strokeLinecap="round"
        />
        {/* Minute arm */}
        <AnimatedLine
          x1={center}
          y1={center}
          animatedProps={minuteAnimatedProps}
          stroke={armColor}
          strokeWidth={minuteArmWidth}
          strokeLinecap="round"
        />
        {/* Center dot */}
        <Circle cx={center} cy={center} r={8} fill={armColor} />
      </Svg>
    </View>
  );
};
