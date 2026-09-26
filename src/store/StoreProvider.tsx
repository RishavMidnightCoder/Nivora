"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store";

// Redux Provider must be a Client Component in the App Router.
// Wrap your root layout's children with this once:
//
//   // app/layout.tsx
//   import { StoreProvider } from "@/store/StoreProvider";
//
//   export default function RootLayout({ children }: { children: ReactNode }) {
//     return (
//       <html lang="en">
//         <body>
//           <StoreProvider>{children}</StoreProvider>
//         </body>
//       </html>
//     );
//   }
export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}