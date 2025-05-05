"use client";
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailTab from './components/EmailTab';
import OtpTab from './components/OtpTab';
import PasswordTab from './components/PasswordTab';

const Items = [
  { component: EmailTab, value: 'email' },
  { component: OtpTab, value: 'otp' },
  { component: PasswordTab, value: 'password' },
];

function CustomTabComponent({ onNext, onPrev, Component }) {
  return <Component onNext={onNext} onPrev={onPrev} />;
}

export default function Page() {
  const [tab, setTab] = useState(0);

  function onNext() {
    setTab((current) => Math.min(current + 1, Items.length - 1));
  }

  function onPrev() {
    setTab((current) => Math.max(current - 1, 0));
  }

  return (
    <div className="flex justify-center items-center w-full h-[60vh]">
      <Tabs
        value={tab}
        onValueChange={setTab}
        className="w-[500px] flex flex-col shadow-lg rounded-lg overflow-hidden"
      >
        <TabsList className="flex justify-center items-center w-full h-10 bg-zinc-800">
          {Items.map((item, index) => (
            <TabsTrigger key={index}
              // disabled={index > tab}
              value={index} className="capitalize">
              {item.value}
            </TabsTrigger>
          ))}
        </TabsList>

        {Items.map((item, index) => (
          <TabsContent
            key={index}
            value={index}
            className="flex-1 w-full bg-zinc-900 rounded-md flex justify-center items-center p-4"
          >
            <CustomTabComponent
              onNext={onNext}
              onPrev={onPrev}
              Component={item.component}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
