"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import codes from "country-calling-code"; // This should contain your country objects
import Image from "next/image";
import React, { useState } from "react";
import { FixedSizeList as List } from "react-window";

const ITEM_HEIGHT = 50;

// Optimized SelectItem component wrapped in React.memo
const OptimizedSelectItem = React.memo(({ index, style, data, onSelect }) => {
  const item = data[index];

  return (
    <div style={style}>
      <SelectItem
        value={item.isoCode2}
        key={item.isoCode2}
        className="flex items-center gap-2 px-2"
        onClick={() => onSelect(item.isoCode2)} // Update selected ISO code when clicked
      >
        <Image
          width={20}
          height={15}
          alt={item.country}
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${item.isoCode2}.svg`}
        />
        <span>{item.country}</span>
        <span className="font-light text-zinc-500">+{item.countryCodes[0]}</span> {/* Show the dial code */}
      </SelectItem>
    </div>
  );
});

export default function PhoneCode() {
  const [selectedCode, setSelectedCode] = useState(""); // Store selected country code (isoCode2)

  // Handle value change for the dropdown
  const handleValueChange = (value) => {
    setSelectedCode(value);
    console.log("Selected country ISO code:", value);
    // Optionally, find full item info
    const selectedItem = codes.find((c) => c.isoCode2 === value);
    console.log("Selected item:", selectedItem);
  };

  // Function to display flag and dial code as the selected value
  const selectedCountry = codes.find((item) => item.isoCode2 === selectedCode);

  return (
    <div>
      <Select className="py-9"
        onValueChange={handleValueChange} value={selectedCode}>
        <SelectTrigger className="w-[120px] py-5">
          {/* Display the flag and dial code as the placeholder */}
          {selectedCountry ? (
            <SelectValue>
              <Image
                width={20}
                height={15}
                alt={selectedCountry.country}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry.isoCode2}.svg`}
              />
              +{selectedCountry.countryCodes[0]} {/* Display dial code */}
            </SelectValue>
          ) : (
            <SelectValue placeholder="(+1)" />
          )}
        </SelectTrigger>
        <SelectContent >
          <List
            height={300}
            itemCount={codes.length}
            itemSize={ITEM_HEIGHT}
            width={300}
            itemData={codes}
          >
            {({ index, style }) => (
              <OptimizedSelectItem
                index={index}
                style={style}
                data={codes}
                onSelect={handleValueChange} // Pass the onSelect function
              />
            )}
          </List>
        </SelectContent>
      </Select>
    </div>
  );
}
