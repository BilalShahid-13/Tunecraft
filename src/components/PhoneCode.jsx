"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import codes from "country-calling-code";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";

const ITEM_HEIGHT = 50;

// Find Mexico in the codes array
const DEFAULT_COUNTRY = codes.find(item => item.countryCodes[0] === "52") || codes[0];

const OptimizedSelectItem = React.memo(({ index, style, data, onSelect }) => {
  const item = data[index];
  return (
    <div style={style}>
      <SelectItem
        value={item.isoCode2}
        key={item.isoCode2}
        className="flex items-center gap-2 px-2"
        onClick={() => onSelect(item.isoCode2)}
      >
        <Image
          width={20}
          height={15}
          alt={item.country}
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${item.isoCode2}.svg`}
        />
        <span>{item.country}</span>
        <span className="font-light text-zinc-500">+{item.countryCodes[0]}</span>
      </SelectItem>
    </div>
  );
});

export default function PhoneCode({ className, signupForm }) {
  const [selectedCode, setSelectedCode] = useState(DEFAULT_COUNTRY.isoCode2);

  // Set default value on mount
  useEffect(() => {
    setSelectedCode(DEFAULT_COUNTRY.isoCode2);
  }, []);

  const handleValueChange = (value) => {
    setSelectedCode(value);
    const selectedItem = codes.find((c) => c.isoCode2 === value);
    signupForm.setValue('phoneCode', `${selectedItem.countryCodes[0]}`);
  };

  const selectedCountry = codes.find((item) => item.isoCode2 === selectedCode);

  return (
    <div>
      <Select
        onValueChange={handleValueChange}
        value={selectedCode}
      >
        <SelectTrigger className={cn(`w-[120px] py-5`, className)}>
          <SelectValue>
            <div className="flex items-center gap-2">
              <Image
                width={20}
                height={15}
                alt={selectedCountry.country}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry.isoCode2}.svg`}
              />
              <span>+{selectedCountry.countryCodes[0]}</span>
            </div>
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
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
                onSelect={handleValueChange}
              />
            )}
          </List>
        </SelectContent>
      </Select>

      {signupForm.formState.errors.phoneCode && (
        <p className="input-error">{signupForm.formState.errors.phoneCode.message}</p>
      )}
    </div>
  );
}