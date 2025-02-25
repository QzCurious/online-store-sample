import * as React from "react"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~/components/ui/toast"

interface ToastContextType {
  toast: (props: {
    title: string
    description?: string
    variant?: "default" | "destructive"
  }) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<Array<{
    id: string
    title: string
    description?: string
    variant?: "default" | "destructive"
  }>>([])

  const toast = React.useCallback(
    ({
      title,
      description,
      variant = "default",
    }: {
      title: string
      description?: string
      variant?: "default" | "destructive"
    }) => {
      const id = Math.random().toString(36).substring(2)
      setToasts((prev) => [...prev, { id, title, description, variant }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        {children}
        {toasts.map(({ id, title, description, variant }) => (
          <Toast key={id} variant={variant}>
            <div className="grid gap-1">
              <ToastTitle>{title}</ToastTitle>
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastContextProvider")
  }
  return context
} 