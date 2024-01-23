import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";
import PrivateLayout from "./layouts/PrivateLayout";

// Errors
import RootError from "./errors/RootError";

// Pages
import Login from "./pages/Login";
import Home, { homeLoader } from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Profile, { profileLoader } from "./pages/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route errorElement={<RootError />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} loader={homeLoader} />

          <Route element={<PrivateLayout />}>
            <Route path="/create-post" element={<CreatePost />} />

            <Route
              path="profile"
              element={<Profile />}
              loader={profileLoader}
            />
          </Route>
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
