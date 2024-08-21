import React from "react";
import { StatusBar, StatusBarStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CustomStatusBarProps = {
  backgroundColor: string;
  barStyle: StatusBarStyle;
};

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({ backgroundColor, barStyle }) => {
  return (
    <SafeAreaView style={{ backgroundColor }}>
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </SafeAreaView>
  );
};

export default CustomStatusBar;
