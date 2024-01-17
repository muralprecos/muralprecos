import logger from "../../services/logger"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  logger.error(`Global Error. ${error.name}\n. ${error.message}\n. ${error.cause}\n. ${error.stack}\n`);
  return (
    <html>
      <body>
        <h2>Something went wrong!!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}