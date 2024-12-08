/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AboutImport } from './routes/about'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as AuthenticatedProfileImport } from './routes/_authenticated/profile'
import { Route as AuthenticatedExpensesImport } from './routes/_authenticated/expenses'
import { Route as AuthenticatedCreateExpenseImport } from './routes/_authenticated/create-expense'
import { Route as AuthenticatedGameProfileIdIndexImport } from './routes/_authenticated/game-profile/$id/index'

// Create/Update Routes

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedProfileRoute = AuthenticatedProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedExpensesRoute = AuthenticatedExpensesImport.update({
  id: '/expenses',
  path: '/expenses',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedCreateExpenseRoute = AuthenticatedCreateExpenseImport.update(
  {
    id: '/create-expense',
    path: '/create-expense',
    getParentRoute: () => AuthenticatedRoute,
  } as any,
)

const AuthenticatedGameProfileIdIndexRoute =
  AuthenticatedGameProfileIdIndexImport.update({
    id: '/game-profile/$id/',
    path: '/game-profile/$id/',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/create-expense': {
      id: '/_authenticated/create-expense'
      path: '/create-expense'
      fullPath: '/create-expense'
      preLoaderRoute: typeof AuthenticatedCreateExpenseImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/expenses': {
      id: '/_authenticated/expenses'
      path: '/expenses'
      fullPath: '/expenses'
      preLoaderRoute: typeof AuthenticatedExpensesImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/profile': {
      id: '/_authenticated/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AuthenticatedProfileImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/game-profile/$id/': {
      id: '/_authenticated/game-profile/$id/'
      path: '/game-profile/$id'
      fullPath: '/game-profile/$id'
      preLoaderRoute: typeof AuthenticatedGameProfileIdIndexImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedRouteChildren {
  AuthenticatedCreateExpenseRoute: typeof AuthenticatedCreateExpenseRoute
  AuthenticatedExpensesRoute: typeof AuthenticatedExpensesRoute
  AuthenticatedProfileRoute: typeof AuthenticatedProfileRoute
  AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute
  AuthenticatedGameProfileIdIndexRoute: typeof AuthenticatedGameProfileIdIndexRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedCreateExpenseRoute: AuthenticatedCreateExpenseRoute,
  AuthenticatedExpensesRoute: AuthenticatedExpensesRoute,
  AuthenticatedProfileRoute: AuthenticatedProfileRoute,
  AuthenticatedIndexRoute: AuthenticatedIndexRoute,
  AuthenticatedGameProfileIdIndexRoute: AuthenticatedGameProfileIdIndexRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof AuthenticatedRouteWithChildren
  '/about': typeof AboutRoute
  '/create-expense': typeof AuthenticatedCreateExpenseRoute
  '/expenses': typeof AuthenticatedExpensesRoute
  '/profile': typeof AuthenticatedProfileRoute
  '/': typeof AuthenticatedIndexRoute
  '/game-profile/$id': typeof AuthenticatedGameProfileIdIndexRoute
}

export interface FileRoutesByTo {
  '/about': typeof AboutRoute
  '/create-expense': typeof AuthenticatedCreateExpenseRoute
  '/expenses': typeof AuthenticatedExpensesRoute
  '/profile': typeof AuthenticatedProfileRoute
  '/': typeof AuthenticatedIndexRoute
  '/game-profile/$id': typeof AuthenticatedGameProfileIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/about': typeof AboutRoute
  '/_authenticated/create-expense': typeof AuthenticatedCreateExpenseRoute
  '/_authenticated/expenses': typeof AuthenticatedExpensesRoute
  '/_authenticated/profile': typeof AuthenticatedProfileRoute
  '/_authenticated/': typeof AuthenticatedIndexRoute
  '/_authenticated/game-profile/$id/': typeof AuthenticatedGameProfileIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/about'
    | '/create-expense'
    | '/expenses'
    | '/profile'
    | '/'
    | '/game-profile/$id'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/about'
    | '/create-expense'
    | '/expenses'
    | '/profile'
    | '/'
    | '/game-profile/$id'
  id:
    | '__root__'
    | '/_authenticated'
    | '/about'
    | '/_authenticated/create-expense'
    | '/_authenticated/expenses'
    | '/_authenticated/profile'
    | '/_authenticated/'
    | '/_authenticated/game-profile/$id/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  AboutRoute: typeof AboutRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  AboutRoute: AboutRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/about"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/create-expense",
        "/_authenticated/expenses",
        "/_authenticated/profile",
        "/_authenticated/",
        "/_authenticated/game-profile/$id/"
      ]
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/_authenticated/create-expense": {
      "filePath": "_authenticated/create-expense.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/expenses": {
      "filePath": "_authenticated/expenses.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/profile": {
      "filePath": "_authenticated/profile.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/game-profile/$id/": {
      "filePath": "_authenticated/game-profile/$id/index.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
