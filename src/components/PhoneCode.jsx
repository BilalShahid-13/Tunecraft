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
          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${item.isoCode2}.svg`}
        />
        <span>{item.country}</span>
        <span className="font-light text-zinc-500">+{item.countryCodes[0]}</span>
      </SelectItem>
    </div>
  );
});

export default function PhoneCode({ className, signupForm, defaultValue='52' }) {
  const [selectedCode, setSelectedCode] = useState("");

  useEffect(() => {
    if (defaultValue) {
      const match = codes.find((item) =>
        item.countryCodes?.some(code => String(code) === String(defaultValue))
      );

      if (match) {
        setSelectedCode(match.isoCode2);
        signupForm.setValue("phoneCode", String(match.countryCodes[0]));
      } else {
        console.warn(`No matching code found for defaultValue: ${defaultValue}`);
      }
    }
  }, [defaultValue, signupForm]);

  const handleValueChange = (value) => {
    const selectedItem = codes.find((c) => c.isoCode2 === value);
    if (selectedItem) {
      setSelectedCode(value);
      signupForm.setValue("phoneCode", String(selectedItem.countryCodes[0]));
    }
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
            {selectedCountry ? (
              <div className="flex items-center gap-2">
                <Image
                  width={20}
                  height={15}
                  alt={selectedCountry.country}
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${selectedCountry.isoCode2}.svg`}
                />
                <span>+{selectedCountry.countryCodes[0]}</span>
              </div>
            ) : (
              <span>Select</span>
            )}
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

      {signupForm?.formState?.errors?.phoneCode && (
        <p className="input-error">{signupForm.formState.errors.phoneCode.message}</p>
      )}
    </div>
  );
}
