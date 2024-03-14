'use client'

import { Card } from "@nextui-org/react";

interface ISimpleInformationPageProp {
  title: string
}

function SimpleInformationPage({
  title = '',
  ...opts
} : ISimpleInformationPageProp) {
  return (
    <div className="w-full flex items-center justify-center gap-3">
      <div className="w-[500px] flex flex-col gap-2 m-4">
        <Card className="w-full space-y-5 p-4" radius="lg">
          <p className="text-md text-gray-600 font-semibold">{title}</p>
        </Card>
      </div>
    </div>
  )
}

export default SimpleInformationPage;