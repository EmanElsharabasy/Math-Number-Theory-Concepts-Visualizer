import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { HomePage } from "./pages/HomePage";
import { SievePage } from "./pages/SievePage";
import { SpfPage } from "./pages/SpfPage";
import { MatrixMultiplicationPage } from "./pages/MatrixMultiplicationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "sieve", Component: SievePage },
      { path: "spf", Component: SpfPage },
      { path: "matrix", Component: MatrixMultiplicationPage },
    ],
  },
]);
