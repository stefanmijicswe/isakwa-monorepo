// Teaching Courses Service Tests
import { teachingCoursesService } from '../teaching-courses.service'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch
global.fetch = jest.fn()

describe('TeachingCoursesService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('mock-auth-token')
  })

  describe('getTeachingCourses', () => {
    it('should fetch teaching courses from backend', async () => {
      const mockAssignments = [
        {
          subject: {
            id: 1,
            name: 'Introduction to Programming',
            code: 'CS101',
            ects: 6,
            semesterType: 'WINTER',
            description: 'Basic programming concepts'
          },
          academicYear: '2024/2025',
          professorId: 26,
          professor: {
            user: {
              firstName: 'John',
              lastName: 'Doe'
            }
          }
        }
      ]

      const mockEnrollments = [
        {
          student: {
            id: 1,
            firstName: 'Ana',
            lastName: 'Marković',
            email: 'ana.markovic@student.edu'
          },
          year: 2,
          status: 'Active',
          attendance: 85,
          assignments: 90,
          midterm: 88,
          final: 92
        }
      ]

      // Mock API responses
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockAssignments)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockEnrollments)
        })

      const result = await teachingCoursesService.getTeachingCourses()

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'Introduction to Programming',
        acronym: 'CS101',
        ects: 6,
        semester: 'Winter',
        status: 'Active',
        students: expect.any(Array)
      })
      expect(result[0].students).toHaveLength(1)
      expect(result[0].students[0].averageGrade).toBe(8.9) // (85+90+88+92)/4 = 88.75 ≈ 8.9
    })

    it('should handle API errors gracefully', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      await expect(teachingCoursesService.getTeachingCourses()).rejects.toThrow('Failed to load teaching courses')
    })
  })

  describe('getPinnedCourses', () => {
    it('should fetch pinned courses from backend', async () => {
      const mockPreferences = {
        pinnedCourses: [1, 3, 5]
      }

      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPreferences)
      })

      const result = await teachingCoursesService.getPinnedCourses()

      expect(result).toEqual([1, 3, 5])
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me/preferences'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-auth-token'
          })
        })
      )
    })

    it('should fallback to localStorage if backend fails', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))
      localStorageMock.getItem.mockReturnValue(JSON.stringify([2, 4]))

      const result = await teachingCoursesService.getPinnedCourses()

      expect(result).toEqual([2, 4])
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pinned-courses')
    })
  })

  describe('savePinnedCourses', () => {
    it('should save pinned courses to backend', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      })

      await teachingCoursesService.savePinnedCourses([1, 2, 3])

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/me/preferences'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ pinnedCourses: [1, 2, 3] }),
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-auth-token',
            'Content-Type': 'application/json'
          })
        })
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith('pinned-courses', JSON.stringify([1, 2, 3]))
    })

    it('should fallback to localStorage if backend fails', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      await teachingCoursesService.savePinnedCourses([1, 2, 3])

      expect(localStorageMock.setItem).toHaveBeenCalledWith('pinned-courses', JSON.stringify([1, 2, 3]))
    })
  })

  describe('togglePinCourse', () => {
    it('should add course to pinned list if not already pinned', async () => {
      const mockPreferences = { pinnedCourses: [1, 3] }
      
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPreferences)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({})
        })

      const result = await teachingCoursesService.togglePinCourse(5)

      expect(result).toEqual([1, 3, 5])
    })

    it('should remove course from pinned list if already pinned', async () => {
      const mockPreferences = { pinnedCourses: [1, 3, 5] }
      
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockPreferences)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({})
        })

      const result = await teachingCoursesService.togglePinCourse(3)

      expect(result).toEqual([1, 5])
    })
  })

  describe('getCourseStudents', () => {
    it('should fetch students for a specific course', async () => {
      const mockEnrollments = [
        {
          student: {
            id: 1,
            firstName: 'Ana',
            lastName: 'Marković',
            email: 'ana.markovic@student.edu'
          },
          year: 2,
          status: 'Active',
          attendance: 85,
          assignments: 90,
          midterm: 88,
          final: 92
        },
        {
          student: {
            id: 2,
            firstName: 'Marko',
            lastName: 'Petrović',
            email: 'marko.petrovic@student.edu'
          },
          year: 1,
          status: 'Active',
          attendance: 75,
          assignments: 80,
          midterm: 0,
          final: 0
        }
      ]

      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockEnrollments)
      })

      const result = await teachingCoursesService.getCourseStudents(1)

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: '1',
        name: 'Ana Marković',
        email: 'ana.markovic@student.edu',
        year: 2,
        status: 'Active',
        averageGrade: 8.9
      })
      expect(result[1]).toMatchObject({
        id: '2',
        name: 'Marko Petrović',
        email: 'marko.petrovic@student.edu',
        year: 1,
        status: 'Active',
        averageGrade: 3.9 // (75+80+0+0)/4 = 38.75 → 3.9
      })
    })

    it('should return sample students if API fails', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      const result = await teachingCoursesService.getCourseStudents(1)

      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('name')
      expect(result[0]).toHaveProperty('email')
      expect(result[0]).toHaveProperty('averageGrade')
    })
  })
})
