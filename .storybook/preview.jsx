import "../src/index.css";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas", value: "#fafaf9" },
        { name: "surface", value: "#ffffff" },
        { name: "dark", value: "#18181b" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;