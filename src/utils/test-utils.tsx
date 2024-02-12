import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// This is important, because it cleans up the state ect. from components
// prevents memory leaks ect.
afterEach(() => {
  cleanup();
});

// function customRender(ui: React.ReactElement, options = {}) {
//   return render(ui, {
//     // wrap provider(s) here if needed
//     wrapper: ({ children }) => children,
//     ...options,
//   })
// }

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// override render export
// export { customRender as render }
