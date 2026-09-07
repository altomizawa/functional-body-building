'use client'
import { fetchWorkout, updateWorkout, getPumpWorkout } from '@/lib/workoutActions'
import { useToast } from '@/hooks/use-toast'
import { useState, useRef, useEffect, useMemo } from "react"
import { findMovementByName } from '@/lib/movementActions'
import { debounce } from '@/utils/debounce'

const useEditWorkout = (initialWorkout) => {
  const [filteredMovements, setFilteredMovements] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [deletePopup, setDeletePopup] = useState(false)
  const [isThereAWorkout, setIsThereAWorkout] = useState(false)
  const [newWorkout, setNewWorkout] = useState(null)

  const toast = useToast().toast
  const movementInputRef = useRef(null)
  const searchIdRef = useRef(0)

  const debouncedSearch = useMemo(
    () => debounce(async (term) => {
      const currentId = ++searchIdRef.current
      try {
        const response = await findMovementByName(term.trim())
        if (currentId !== searchIdRef.current) return
        if (response?.success && response?.data) {
          setFilteredMovements(response.data)
        } else {
          setFilteredMovements([])
        }
      } catch (error) {
        if (currentId !== searchIdRef.current) return
        console.error('Error finding movement by name:', error)
        setFilteredMovements([])
      }
    }, 300),
    []
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.()
    }
  }, [debouncedSearch])

  // RESET ALL FORMS
  const resetForm = () => {
    debouncedSearch.cancel?.()
    setFilteredMovements(null)
    setSearchText('')
    setNewWorkout(null)
    setCurrentSection(0)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await updateWorkout(newWorkout)
      if (!response.success) {
        toast({
          title: 'Error',
          description: response.error,
        })
        return
      }
      toast({
        title: 'Success',
        description: 'Workout updated successfully',
      })

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create workout',
      })
      console.error(error)
    }
    resetForm()
    setIsThereAWorkout(false)
  }

  const handleWorkoutChange = (e) => {
    setNewWorkout(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSectionChange = (e, sectionIndex) => {
    const index = sectionIndex !== undefined ? sectionIndex : currentSection

    setNewWorkout(prev => ({
      ...prev,
      sections: prev.sections.map((section, idx) => {
        if (idx === index) {
          return {
            ...section,
            [e.target.name]: e.target.value
          }
        }
        return section
      })
    }))
  }

  // HANDLE MOVEMENT SEARCH
  const handleMovementSearch = (e, index) => {
    const searchValue = e.target.value
    setSearchText(searchValue)
    setCurrentSection(index)

    if (!searchValue || searchValue.trim().length === 0) {
      debouncedSearch.cancel?.()
      setFilteredMovements(null)
      return
    }

    debouncedSearch(searchValue)
  }

  const addMovement = (movement) => {
    setNewWorkout(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => {
        if (index === currentSection) {
          // Check if movement already exists in this section
          if (!section.movements.some(m => m._id === movement._id)) {
            return {
              ...section,
              movements: [...section.movements, movement]
            };
          }
        }
        return section;
      })
    }));

    debouncedSearch.cancel?.();
    setFilteredMovements(null);
    setSearchText('');
    if (movementInputRef.current) {
      movementInputRef.current.value = '';
    }
  };

  const removeMovement = (movement, sectionIndex) => {
    setNewWorkout(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) => {
        if (index === sectionIndex) {
          return {
            ...section,
            movements: section.movements.filter(prevMovement =>
              prevMovement._id !== movement._id
            )
          };
        }
        return section;
      })
    }));
  };

  const addNewSection = () => {
    setNewWorkout(prev => ({
      ...prev,
      sections: [...prev.sections, {
        section: '',
        icon: '',
        description: '',
        movements: [],
        notes: ''
      }]
    }))
    setCurrentSection(newWorkout.sections.length)
  }

  const removeSection = (indexToRemove) => {
    if (newWorkout.sections.length <= 1) {
      toast({
        title: 'Error',
        description: 'Cannot remove the only section',
      })
      return
    }

    setNewWorkout(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== indexToRemove)
    }));

    // Adjust current section index if needed
    setCurrentSection(prev => (prev >= indexToRemove ? Math.max(prev - 1, 0) : prev));
  };

  const selectSection = (index) => {
    setCurrentSection(index)
    debouncedSearch.cancel?.()
    setFilteredMovements(null)
    setSearchText('')
  }

  const getWorkout = async (formData) => {
    const workoutType = formData.get('workoutType') || 'pillars'
    try {
      let workoutData;
      if (workoutType === 'pump4x') {
        const selectedDate = formData.get('selectedDate')
        workoutData = await getPumpWorkout({ date: selectedDate })
        if (!workoutData.success) {
          toast({
            title: 'Error',
            description: workoutData.error || 'No Pump 4x workout found for this date',
          })
          return
        }
        setNewWorkout({
          ...workoutData.data,
          workoutType: 'pump4x',
          date: workoutData.data.date ? new Date(workoutData.data.date).toISOString().split('T')[0] : '',
        })
      } else {
        const selectedProgram = formData.get('selectedProgram')
        const selectedWeek = formData.get('selectedWeek')
        const selectedDay = formData.get('selectedDay')
        workoutData = await fetchWorkout(selectedProgram, selectedWeek, selectedDay)
        if (!workoutData.success) {
          toast({
            title: 'Error',
            description: workoutData.error,
          })
          return
        }
        setNewWorkout({
          ...workoutData.data,
          workoutType: 'pillars',
        })
      }

      setIsThereAWorkout(true)
      toast({
        title: 'Success',
        description: 'Workout fetched successfully',
      })
    } catch (error) {
      console.error('Error fetching workout:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch workout',
      })
    }
  }

  return {
    filteredMovements,
    currentSection,
    searchText,
    deletePopup,
    isThereAWorkout,
    newWorkout,
    resetForm,
    onSubmit,
    handleWorkoutChange,
    handleSectionChange,
    handleMovementSearch,
    addMovement,
    removeMovement,
    addNewSection,
    removeSection,
    selectSection,
    getWorkout,
    setDeletePopup,
    setIsThereAWorkout,
    setFilteredMovements,
    setCurrentSection,
    setSearchText,
    setNewWorkout,
  }
}


export default useEditWorkout;