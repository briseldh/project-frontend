import { cleanup, render } from "@testing-library/react";
import { isValidElement } from "react";
import {
  RouteObject,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import { afterEach } from "vitest";

// This is important, because it cleans up the state ect. from components
// prevents memory leaks ect.
afterEach(() => {
  cleanup();
});

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  });
}

export const renderWithRouter = (
  children: React.ReactElement,
  routes: RouteObject[] = []
) => {
  const options = isValidElement(children)
    ? { element: children, path: "/" }
    : (children as RouteObject);

  const router = createMemoryRouter([{ ...options }, ...routes], {
    initialEntries: options.path ? [options.path] : [],
    initialIndex: 1,
  });

  return render(<RouterProvider router={router} />);
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// override render export
export { customRender as render };
