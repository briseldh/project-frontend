import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";

// Errors
import RootError from "./errors/RootError";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route errorElement={<RootError />}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />

          <Route path="/create-post" element={<CreatePost />} />

          <Route path="profile" element={<Profile />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
