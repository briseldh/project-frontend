import { expect, it } from "vitest";
import TestFile, { multiply, sum } from "../components/01-test-file/TestFile";
import { render, screen } from "../utils/test-utils";

describe("Costum Functions", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should sum up 1 + 2 correctly", () => {
    expect(sum(1, 2)).toBe(3);
  });

  it("multiplies 2 and 2 to 4 ", () => {
    const mockCallback = vi.fn();

    expect(multiply(2, 2, mockCallback)).toBe(4);
  });

  it("multiplies 2 and 2 and calls the callback the result times", () => {
    const mockCallback = vi.fn();

    multiply(2, 2, mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(4);
  });
});

describe("Component: TestFile", () => {
  it("should render TestsFile correctly", () => {
    render(<TestFile />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
