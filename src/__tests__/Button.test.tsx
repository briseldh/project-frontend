import Button from "../components/Button";
import { render, screen, userEvent } from "../utils/test-utils";

describe("Component: Button", () => {
  it("renders correctly", () => {
    render(
      <Button
        value="Click me!"
        type="button"
        disabled={undefined}
        styles=""
        onClick={() => null}
      />
    );

    const button = screen.queryByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("clicks correctly (user-event >v14)", async () => {
    //Testing description:
    // - In this test, with the help of the mock function, I check that the onClick works properly.

    //Arange
    userEvent.setup;
    const handleClick = vi.fn();

    render(
      <Button
        value="Click me!"
        type="button"
        disabled={undefined}
        styles=""
        onClick={handleClick}
      />
    );

    const button = screen.getByRole("button");

    // ACT
    await userEvent.click(button);

    // Alternative:
    // await userEvent.pointer({
    //   keys: "[MouseLeft]",
    //   target: button,
    // });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
