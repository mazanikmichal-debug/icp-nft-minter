import { Skeleton } from "@/components/ui/skeleton";
import { WalletProvider } from "@/providers/WalletProvider";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const MintPage = lazy(() =>
  import("@/pages/MintPage").then((m) => ({ default: m.MintPage })),
);
const GalleryPage = lazy(() =>
  import("@/pages/GalleryPage").then((m) => ({ default: m.GalleryPage })),
);

function PageLoader() {
  return (
    <div className="flex-1 p-6 space-y-4 max-w-5xl mx-auto w-full">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <WalletProvider>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </WalletProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Navigate to="/mint" />,
});

const mintRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mint",
  component: MintPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});

const routeTree = rootRoute.addChildren([indexRoute, mintRoute, galleryRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
