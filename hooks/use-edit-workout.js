'use client'
import { debounce } from '@/utils/debounce'
import { findMovementByName } from '@/lib/movementActions'
import { fetchWorkout, updateWorkout } from '@/lib/workoutActions'
import { useToast } from '@/hooks/use-toast'
import { useState, useRef, useCallback, useMemo } from "react"

const useEditWorkout = (initialWorkout) => {
  const [filteredMovements, setFilteredMovements] = useState(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [deletePopup, setDeletePopup] = useState(false)
  const [isThereAWorkout, setIsThereAWorkout] = useState(false)
  const [newWorkout, setNewWorkout] = useState(null)

  const toast = useToast().toast
  const movementInputRef = useRef(null)

  // RESET ALL FORMS
  const resetForm = () => {
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

  // FETCH MOVEMENTS WITH DEBOUNCE
  const fetchMovements = useMemo(
    () => debounce(async (searchValue, index) => {
      if(searchValue === '') {
        setFilteredMovements(null)
        return
      }
      if(searchValue.length < 3) return;
      setCurrentSection(index)
    
      const response = await findMovementByName(searchValue)
      console.log(response.data)
      setFilteredMovements(response.data)
    }, 1500),
    []
  )

  // HANDLE MOVEMENT SEARCH
  const handleMovementSearch = (e, index) => {
    const searchValue = e.target.value
    setSearchText(searchValue)
    
    if (!searchValue) {
      setFilteredMovements(null)
      return
    }
    setCurrentSection(index)
    fetchMovements(searchValue, index)
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
    setFilteredMovements(null)
    setSearchText('')
  }

  const getWorkout = async(formData) => {
    const selectedProgram = formData.get('selectedProgram')
    const selectedWeek = formData.get('selectedWeek')
    const selectedDay = formData.get('selectedDay')
    try {
      const workoutData = await fetchWorkout(selectedProgram, selectedWeek, selectedDay)
      if (!workoutData.success) {
        toast({
          title: 'Error',
          description: workoutData.error,
        })
        return
      }
      setNewWorkout(workoutData.data)
      setIsThereAWorkout(true)
      toast({
        title: 'Success',
        description: 'Workout fetched successfully',
      })
      // resetForm();
    } catch (error) {
      console.error('Error fetching workout:', error)
      // resetForm()
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