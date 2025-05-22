// @ts-nocheck - Ignoring type errors during build
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface EventImage {
  id: number;
  imageName?: string;
  imageUrl?: string;
}