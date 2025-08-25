import React from "react";
import Svg, { Path } from "react-native-svg";

type Props = { size?: number; };

export default function GoogleLogo24({ size = 24 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Blue */}
      <Path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.3h6.5c-.3 1.5-1.1 2.7-2.3 3.6v3h3.7c2.2-2 3.6-4.9 3.6-8.6z"
      />
      {/* Green */}
      <Path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.8-3l-3.7-3c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.7-2.1-6.6-5H1.6v3.2C3.6 21 7.5 24 12 24z"
      />
      {/* Yellow */}
      <Path
        fill="#FBBC05"
        d="M5.4 14.2c-.2-.7-.3-1.5-.3-2.2s.1-1.5.3-2.2V6.6H1.6C.8 8.2.3 10 .3 12s.5 3.8 1.3 5.4l3.8-3.2z"
      />
      {/* Red */}
      <Path
        fill="#EA4335"
        d="M12 4.7c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.1 0 12 0 7.5 0 3.6 3 1.6 7.4l3.8 3C6.3 6.8 8.9 4.7 12 4.7z"
      />
    </Svg>
  );
}
