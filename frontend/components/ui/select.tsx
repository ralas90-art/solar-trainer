"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

const SelectContext = React.createContext<{ value?: string }>({})

const Select = ({ children, onValueChange, value, ...props }: SelectProps) => {
  const content = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && (child.type as any).name === "SelectContent"
  ) as React.ReactElement | undefined

  const options = content ? content.props.children : children

  return (
    <SelectContext.Provider value={{ value: value as string }}>
      <div className="relative group min-w-[140px]">
        {/* Visual Layer */}
        <div className="flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white group-focus-within:ring-2 group-focus-within:ring-[#FF5722] transition-all">
          <div className="flex items-center gap-2 overflow-hidden">
            {React.Children.toArray(children).find(
              (child) => React.isValidElement(child) && (child.type as any).name === "SelectTrigger"
            )}
            <span className="truncate">
              {React.Children.toArray(options)
                .filter((child): child is React.ReactElement => React.isValidElement(child))
                .find((child) => child.props.value === value)?.props.children || "Select..."}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500 group-focus-within:text-[#FF5722]" />
        </div>

        {/* Functional Layer (Invisible Select) */}
        <select
          value={value}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => onValueChange?.(e.target.value)}
          {...props}
        >
          {options}
        </select>
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  // Extract only the icons/prefix, not the SelectValue placeholder which we handle manually
  return <div className={cn("flex items-center gap-2", className)}>{
    React.Children.toArray(children).filter(child => 
      React.isValidElement(child) && (child.type as any).name !== "SelectValue"
    )
  }</div>
}

const SelectValue = ({ placeholder }: { placeholder?: string }) => null

const SelectContent = ({ children, className }: { children: React.ReactNode; className?: string }) => <>{children}</>

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value} className="bg-[#1A1A1A] text-white">{children}</option>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
