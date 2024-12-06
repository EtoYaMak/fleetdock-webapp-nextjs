"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
}

export function DatePicker({ value, onChange, placeholder = "Pick a date" }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            "border-[#4895d0]/30 bg-[#1a2b47] text-[#f1f0f3] hover:bg-[#1a2b47]/90",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#1a2b47] border-[#4895d0]/30">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="bg-[#1a2b47]"
          classNames={{
            head_cell: "text-[#4895d0] font-normal text-[0.8rem]",
            day_selected: "bg-[#4895d0] text-white hover:bg-[#4895d0]/90",
            day_today: "bg-[#4895d0]/20 text-[#f1f0f3]",
            day: "text-[#f1f0f3] hover:bg-[#4895d0]/20",
            day_disabled: "text-[#f1f0f3]/30",
            nav_button: "text-[#f1f0f3] hover:bg-[#4895d0]/20",
            nav_button_previous: "hover:bg-[#4895d0]/20",
            nav_button_next: "hover:bg-[#4895d0]/20",
            caption: "text-[#f1f0f3]"
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
