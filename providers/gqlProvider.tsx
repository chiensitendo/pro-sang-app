"use client";

import { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@/libs/apollo-client";

export function GqlProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(createApolloClient());
  return <ApolloProvider client={client}>{children} </ApolloProvider>;
}
