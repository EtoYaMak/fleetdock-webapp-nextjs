import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TripCostCalculator } from "./TripCostCalculator";
import { TripCalculatorProvider } from "@/context/TripCalculatorContext";

export function TripCalculatorRes() {
  const [open, setOpen] = React.useState(false);

  return (
    <TripCalculatorProvider>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className="bg-red-800 text-white hover:bg-black hover:text-white transition-colors duration-300"
          >
            Calculate Trip Cost
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl ">
            <DrawerHeader className="flex items-center justify-between">
              <DrawerTitle>Trip Cost Calculator</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 ">
              <TripCostCalculator />
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </TripCalculatorProvider>
  );
}
