import { Toaster, toast } from "sonner";

const background = {
  success: "#e6f4ea",
  error: "#fbeaea",
  warning: "#fff7e0",
  info: "#e7f0fb",
};

const color = {
  success: "#276749",
  error: "#9b2c2c",
  warning: "#975a16",
  info: "#2c5282",
};

const border = {
  success: "#a3e3b0",
  error: "#f5a6a6",
  warning: "#fde59a",
  info: "#a9d1f5",
};

export interface NotifyOptions {
  id?: string | number;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function notify(
  type: keyof typeof background,
  message: string,
  descriptionOrOptions?: string | NotifyOptions,
  maybeOptions?: NotifyOptions
) {
  const options: NotifyOptions =
    typeof descriptionOrOptions === "object" && descriptionOrOptions !== null
      ? descriptionOrOptions
      : {
          description: typeof descriptionOrOptions === "string" ? descriptionOrOptions : undefined,
          ...maybeOptions,
        };

  toast[type](message, {
    id: options.id,
    description: options.description,
    duration: options.duration ?? (type === "error" ? 5000 : 3000),
    action: options.action,
    style: {
      backgroundColor: background[type],
      color: color[type],
      border: `1px solid ${border[type]}`,
    },
    classNames: {
      icon: "text-inherit",
      title: "text-inherit",
      description: "text-inherit",
    },
  });
}

export function NotifyToaster() {
  return (
    <Toaster
      position="bottom-left"
      closeButton={true}
      toastOptions={{
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "0.95rem",
        },
        classNames: {
          toast: "rounded-lg shadow-md px-4 py-2",
          icon: "text-inherit",
          title: "font-semibold text-inherit",
          description: "text-inherit opacity-90",
        },
      }}
    />
  );
}
