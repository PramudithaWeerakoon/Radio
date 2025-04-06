"use client";

import * as React from "react";
import { ToastContainer, toast as reactToastifyToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToasterComponent() {
  return <ToastContainer />;
}

export const toast = reactToastifyToast;