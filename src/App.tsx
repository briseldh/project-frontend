import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Layouts
import RootLayout from "./layouts/RootLayout";
import PrivateLayout from "./layouts/PrivateLayout";

// Errors
import RootError from "./errors/RootError";

// Pages
// import Login from "./pages/Login";
const Login = lazy(() => import("./pages/Login"));
import Home, { HomeLoader } from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
// const Profile = lazy(() => import("./pages/Profile"));
// const profileLoader = lazy(() => import("./pages/Profile"));
// import { profileLoader } from "./pages/Profile";
import { Oval } from "react-loader-spinner";
import Profile, { ProfileLoader } from "./pages/Profile";

const homeQueryClient = new QueryClient();
const profileQueryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route errorElement={<RootError />}>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<RootLayout />}>
          <Route
            index
            element={<Home />}
            loader={HomeLoader(homeQueryClient)}
          />

          <Route
            path="/login"
            element={
              <Suspense
                fallback={
                  <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                    <Oval
                      height="60"
                      width="60"
                      color="#6464C8"
                      secondaryColor="#6464C8"
                    />
                  </div>
                }
              >
                <Login />
              </Suspense>
            }
          />

          <Route path="/register" element={<Register />} />

          <Route element={<PrivateLayout />}>
            <Route path="/create-post" element={<CreatePost />} />

            <Route
              path="profile"
              element={<Profile />}
              loader={ProfileLoader(profileQueryClient)}
            />
          </Route>
        </Route>
      </Route>
    </>
  )
);

function App() {
  return (
    // <QueryClientProvider client={homeQueryClient}>
    //   <RouterProvider router={router} />
    //   <ReactQueryDevtools />
    // </QueryClientProvider>

    <RouterProvider router={router} />
  );
}

export default App;
