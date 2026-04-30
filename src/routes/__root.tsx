import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "UTF-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "nads.io — Your link in bio" },
      {
        name: "description",
        content:
          "Create your nads.io bio link in seconds. Sign in, pick a username, share your links.",
      },
      { property: "og:title", content: "nads.io — Your link in bio" },
      {
        property: "og:description",
        content: "Create your nads.io bio link in seconds.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "nads.io — Your link in bio" },
      { name: "twitter:description", content: "nads.io creates a custom bio link page for you." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/aaae3d83-3d64-467a-b8ea-d1494f03e8cd/id-preview-87c9de3b--47a8b294-a759-44d3-bd50-6e8b8e3af3b3.lovable.app-1777371899564.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/aaae3d83-3d64-467a-b8ea-d1494f03e8cd/id-preview-87c9de3b--47a8b294-a759-44d3-bd50-6e8b8e3af3b3.lovable.app-1777371899564.png" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <div style={{ padding: 32, textAlign: "center" }}>
      <h1>404</h1>
      <a href="/">Go home</a>
    </div>
  ),
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Outlet />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
