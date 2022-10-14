import { extendTheme } from "@chakra-ui/react";

const colors = {
  gray: {
    "50": "#F2F2F2",
    "100": "#DBDBDB",
    "200": "#C4C4C4",
    "300": "#ADADAD",
    "400": "#969696",
    "500": "#808080",
    "600": "#666666",
    "700": "#4D4D4D",
    "800": "#333333",
    "900": "#1A1A1A",
  },
  purple: {
    "50": "#F3E9FC",
    "100": "#DCC0F6",
    "200": "#C698F1",
    "300": "#B06FEB",
    "400": "#9947E6",
    "500": "#831FE0",
    "600": "#6919B3",
    "700": "#4F1287",
    "800": "#340C5A",
    "900": "#1A062D",
  },
  pink: {
    "50": "#FCE9FA",
    "100": "#F6C1F1",
    "200": "#F099E8",
    "300": "#EA71DE",
    "400": "#E449D5",
    "500": "#DE21CC",
    "600": "#B21AA3",
    "700": "#85147A",
    "800": "#590D52",
    "900": "#2C0729",
  },
} as const;

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  semanticTokens: {
    colors: {
      "chakra-body-bg": { _dark: "gray.900" },
    },
  },
  colors,
});

export default theme;
