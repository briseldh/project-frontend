import { lazy, Suspense } from "react";
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
const Login = lazy(() => import("./pages/Login"));
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import { Oval } from "react-loader-spinner";
import Profile from "./pages/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route errorElement={<RootError />}>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />

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

            <Route path="profile" element={<Profile />} />
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
