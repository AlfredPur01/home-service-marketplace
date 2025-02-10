"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Hero = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchService = async () => {
    router.push(`/search/${query}`);
  };
  return (
    <div className="flex items-center flex-col justify-center pt-14 pb-7">
      <h2 className="font-bold text-[46px] text-center">
        Find Home
        <span className="text-red-600"> Service/Repair</span>
        <br></br> Near You
      </h2>
      <h2 className="text-xl text-gray-500">
        Explore Best Home Service & Repair near you
      </h2>
      <div className="mt-4 flex items-center gap-3">
        <Input
          placeholder="Search"
          className="rounded-full md:w-[350px]"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <Button className="rounded-full h-[46px]" onClick={searchService}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Hero;
