import Button from "../components/Button";
import { render, screen } from "../utils/test-utils";

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

    // similar to -> const buttonInVanillaJs = document.querySelector()
    //Screen functions:
    //getBy -> bei einem existierendem element
    //queryBy -> bei einem vorhandenem Element aber nicht im (Virtual) DOM
    //findBy -> bei asynchronen Operationen

    //Die Reienfolge um was wir testen sollten: Role, LabelText, PlaceholderText, Text, DisplayValue
    //                                          AltText, Title, TestId

    const button = screen.queryByRole("button");

    expect(button).toBeInTheDocument();
  });
});
