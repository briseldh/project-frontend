import Login from "../pages/Login";
import Register from "../pages/Register";
import { fireEvent, renderWithRouter, screen } from "../utils/test-utils";

describe("Component: Login", () => {
  it("renders correctly", () => {
    renderWithRouter(<Login />);
  });

  it("has the needed labels, input fields and button", () => {
    //Testing description:
    // - In this test i check that the email and password inputs are present in the document when the component renders.

    renderWithRouter(<Login />);

    const emailLabel = screen.getByText(/e\-mail/i);
    const emailInputField = screen.getByRole("textbox", { name: /e\-mail/i });
    expect(emailLabel).toBeInTheDocument();
    expect(emailInputField).toBeInTheDocument();

    const passwordLabel = screen.getByText(/Password/i);
    const passwordInputField = screen.getByLabelText(/password/i);
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordInputField).toBeInTheDocument();

    const loginBtn = screen.getByRole("button", { name: /login/i });
    expect(loginBtn).toBeInTheDocument();
  });

  it("redirects to the register form when user clicks the link in the bottom", () => {
    // Test description:
    // - In this test I prove that the register link in the bottom of the formular works

    renderWithRouter(<Login />, [
      {
        path: "/register",
        element: <Register />,
      },
    ]);

    const registerRedirectLink = screen.getByRole("link", {
      name: /register/i,
    });
    expect(registerRedirectLink).toBeInTheDocument();
    fireEvent.click(registerRedirectLink);
    const registerHeading = screen.getByRole("heading", { name: /register/i });
    expect(registerHeading).toBeInTheDocument();
  });
});
