import { useContext } from 'react'
import { CourseContext } from '../context/CourseContext'

export function useCourseData() {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourseData must be used within a CourseProvider')
  }
  return context
}

