'use client'

import { Card, Skeleton } from "@nextui-org/react";

function LoadingPage({
  ...opts
}) {
  return (
    <div className="w-full flex items-center justify-center gap-3">
      <div className="w-[500px] flex flex-col gap-2 m-4">
        <Card className="w-full space-y-5 p-4" radius="lg">
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">  
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
        </Card>
      </div>
    </div>
  )
}

export default LoadingPage;