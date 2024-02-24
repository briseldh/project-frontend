import Nav from "../components/Nav";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import { renderWithRouter, screen, fireEvent } from "../utils/test-utils";
import { Auth, AuthContext } from "../context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "../pages/Register";
import Login from "../pages/Login";
import CreatePost from "../pages/CreatePost";

describe("Component: Nav", () => {
  it("renders correctly", () => {
    // Test description:
    // - In this test, I only check if the Nav component renders correctly. In this case the normal render method does not work because the Nav component has React-Router components inside. Thats why I use the rendrWithRoter method that i get from the test-utils, where I did the needed configurations

    renderWithRouter(<Nav />, [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ]);
  });

  it("has these links when user is not logged in", () => {
    // Test description:
    // - In this test I check and prove the links that are inside the Nav component. I also check what happens when you click them.

    renderWithRouter(<Nav />, [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ]);

    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeInTheDocument;

    const loginLink = screen.getByText(/Login/i);
    expect(loginLink).toBeInTheDocument;

    const registerLink = screen.getByText(/Register/i);
    expect(registerLink).toBeInTheDocument;

    // When the user clicks the login link he expects to see a login formular and maybe a heading which says Login. That is exactly the case in my code. The user clicks the login link and the Login headig shows in the document.
    fireEvent.click(loginLink);
    const loginHeading = screen.getByRole("heading", { level: 1 });
    expect(loginHeading).toBeInTheDocument();

    // We also have scenarios when the user does not have an account. In this case he wants to register as a new user. Here I have tested the registerRedirectLink that is in the bottom of the Login from.
    const registerRedirectLink = screen.getByRole("link", {
      name: /register/i,
    });
    fireEvent.click(registerRedirectLink);
    const registerHeading = screen.getByRole("heading", { level: 1 });
    expect(registerHeading).toBeInTheDocument();
  });

  it("has these links when the user is logged in", () => {
    // Test description:
    // - In this test i check and prove the links that are inside the Nav component when the user is logged in. In my project I have worked with React-query and Context also. That why to test this scenario I have to wrap the Nav component with the QueryClientProvider and the AuthContextProvider to stimulate a logged in user.

    const authValue = {
      auth: {
        id: 1,
        username: "Briseld",
        requestStatus: "sent",
        role: "user",
      } as Auth,
      setAuth: () => {},
    };

    const queryClient = new QueryClient();

    renderWithRouter(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authValue}>
          <Nav />
        </AuthContext.Provider>
      </QueryClientProvider>,
      [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/create-post",
          element: <CreatePost />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ]
    );

    const homeLink = screen.getByText(/Home/i);
    expect(homeLink).toBeInTheDocument;

    const profileLink = screen.getByText(/Profile/i);
    expect(profileLink).toBeInTheDocument();

    const createPostLink = screen.getByText(/Create Post/i);
    expect(createPostLink).toBeInTheDocument();

    const logoutBtn = screen.getByText(/log out/i);
    expect(logoutBtn).toBeInTheDocument();
  });
});
