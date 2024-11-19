import { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router"
import { Toaster } from "@/components/ui/sonner"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
})

function NavBar() {
  return (
    <div className="flex min-h-screen fixed border-r-primary border-r">
      <nav className="p-4 w-48 bg-background flex flex-col gap-4 text-text">
        <Link to="/" className="[&.active]:font-semibold group">
          <h1 className="text-xl font-bold mb-4 text-accent group-hover:scale-105 transition-transform duration-300">
            Cyclic Resonance
          </h1>
        </Link>
        <Link
          to="/about"
          className="relative [&.active]:font-semibold [&.active]:text-accent  text-text hover:text-accent group"
        >
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            About
          </span>
          <div className="absolute left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></div>
        </Link>
        <Link
          to="/expenses"
          className="relative [&.active]:font-semibold [&.active]:text-accent text-text hover:text-accent group"
        >
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            Expenses
          </span>
          <div className="absolute left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></div>
        </Link>
        <Link
          to="/create-expense"
          className="relative [&.active]:font-semibold [&.active]:text-accent text-text hover:text-accent group"
        >
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            Create Expense
          </span>
          <div className="absolute left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></div>
        </Link>
        <Link
          to="/profile"
          className="relative [&.active]:font-semibold [&.active]:text-accent text-text hover:text-accent group"
        >
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            Profile
          </span>
          <div className="absolute left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></div>
        </Link>
      </nav>
    </div>
  )
}

function Root() {
  return (
    <>
      <NavBar />
      <div className="p-2 gap-2 max-w-2xl m-auto">
        <Outlet />
      </div>
      <Toaster />
    </>
  )
}
