// SheetComponent.tsx
"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Define the props for the SheetComponent
interface SheetComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

// Create the SheetComponent
const SheetComponent: React.FC<SheetComponentProps> = ({
  open,
  onOpenChange,
  title,
  description,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SheetComponent;
