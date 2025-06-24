import { twMerge } from "tailwind-merge";

export const tw = (...classes: string[]) => {
    return twMerge(classes);
}