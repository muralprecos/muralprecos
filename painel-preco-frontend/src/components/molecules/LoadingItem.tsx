'use client'

import { Card, Skeleton } from "@nextui-org/react";

function LoadingItem({
  ...opts
}) {
  return (
    <div className="w-full flex items-center justify-center gap-3">
      <div className="w-[500px] flex flex-col gap-2 m-4">
        <Card className="w-full space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <Skeleton className="h-3 w-4/5 rounded-lg"/>
          <Skeleton className="h-3 w-3/5 rounded-lg"/>
          <Skeleton className="h-3 w-5/5 rounded-lg"/>
          <Skeleton className="h-3 w-4/5 rounded-lg"/>
        </Card>
      </div>
    </div>
  )
}

export default LoadingItem;