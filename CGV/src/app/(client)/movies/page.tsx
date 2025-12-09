// Server wrapper: force dynamic rendering and render the client-side component.
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import MoviesClient from "./MoviesClient";
import Loading from "@/components/shared/Loading";

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loading size="lg" text="Đang tải phim..." /></div>}>
      <MoviesClient />
    </Suspense>
  );
}
 
