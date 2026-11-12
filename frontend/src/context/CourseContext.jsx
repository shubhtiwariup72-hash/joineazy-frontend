import { createContext, useCallback, useState } from 'react'

export const CourseContext = createContext(null)

export function CourseProvider({ children }) {
  const [dataVersion, setDataVersion] = useState(0)

  const triggerDataRefresh = useCallback(() => {
    setDataVersion((prev) => prev + 1)
  }, [])

  const value = {
    dataVersion,
    triggerDataRefresh,
  }

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
}

