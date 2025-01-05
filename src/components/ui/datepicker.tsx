"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  popoverContentClassName?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  popoverContentClassName,
}: DatePickerProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  useEffect(() => {
    if (value) {
      setFormattedDate(format(value, "PPP"));
    }
  }, [value]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {value ? formattedDate : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0 pointer-events-auto",
          popoverContentClassName
        )}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className={className}
        />
      </PopoverContent>
    </Popover>
  );
}
