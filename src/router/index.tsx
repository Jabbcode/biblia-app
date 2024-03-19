import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import ChaptersPage from "@/pages/ChaptersPage";
import ChapterPage from "@/pages/ChapterPage";
import Home from "@/pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/chapters/:book",
        element: <ChaptersPage />
      },
      {
        path: "/chapters/:book/:chapter",
        element: <ChapterPage />
      }
    ]
  }
]);


export default router;