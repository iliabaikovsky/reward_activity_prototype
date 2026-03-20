import { createContext, useContext, useState, type ReactNode } from 'react'

const DeviceFrameContext = createContext<HTMLDivElement | null>(null)

export function DeviceFrameProvider({ children }: { children: ReactNode }) {
  const [frameEl, setFrameEl] = useState<HTMLDivElement | null>(null)
  return (
    <DeviceFrameContext.Provider value={frameEl}>
      <div className="device-frame" ref={setFrameEl}>
        {children}
      </div>
    </DeviceFrameContext.Provider>
  )
}

export function useDeviceFrameEl(): HTMLDivElement | null {
  return useContext(DeviceFrameContext)
}
