"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="mx-6 md:mx-16">
      <div className="p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-8 ">
          <Link href="/" className="flex items-center font-bold text-lg gap-2">
            <Image src="/logo.svg" alt="logo" width={50} height={50} />
            Home Service
          </Link>
          
        </div>
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      {user.name && user.name.length > 0
                        ? user.name[0].toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  )}
                  <span className="sr-only">Toggle user menu</span>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem className="font-bold text-lg">
                  {user.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/create-service" className="block w-full text-left">
                    Create a service
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/service?id=${user.id}`} className="block w-full text-left">
                    my service
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/booking" className="block w-full text-left">
                    Booking
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/appointment" className="block w-full text-left">
                    Appointment
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    className="block w-full text-left"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button>
              <Link href="/register">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
