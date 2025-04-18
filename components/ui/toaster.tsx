"use client"

import * as React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import "react-toastify/dist/ReactToastify.css";

export function Toaster() {
  const [toasts, setToasts] = React.useState([])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }: {
        id: string;
        title?: React.ReactNode;
        description?: React.ReactNode;
        action?: React.ReactNode;
        [key: string]: any;
      }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}