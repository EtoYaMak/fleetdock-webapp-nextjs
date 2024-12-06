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
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export default function DatePicker({
  onChange,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onChange) {
      onChange(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            "bg-[#1a2b47] border-[#4895d0]/30 text-[#f1f0f3] hover:bg-[#1a2b47]/90",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#1a2b47] border-[#4895d0]/30">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          className="bg-[#1a2b47] text-[#f1f0f3]"
          classNames={{
            day_selected: "bg-[#4895d0] text-white hover:bg-[#4895d0]/90",
            day_today: "bg-[#4895d0]/20 text-[#f1f0f3]",
            day: "text-[#f1f0f3] hover:bg-[#4895d0]/20",
            day_disabled: "text-[#f1f0f3]/30",
            nav_button: "text-[#f1f0f3] hover:bg-[#4895d0]/20",
            head_cell: "text-[#f1f0f3]",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
