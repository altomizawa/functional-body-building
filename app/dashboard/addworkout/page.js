"use client"

import { useState } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import movements from '@/lib/movements'


export default function WorkoutForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      workout: [{ section: "", icon: "", exercises: [{ name: "", description: "", video: "" }] }],
    },
  })

  const {
    fields: workoutFields,
    append: appendWorkout,
    remove: removeWorkout,
  } = useFieldArray({
    control,
    name: "workout",
  })

  const onSubmit = (data) => {
    // Here you would typically send this data to your backend
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <Input id="date" type="date" {...register("date", { required: "Date is required" })} />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>
            <div>
              <label htmlFor="program" className="block text-sm font-medium text-gray-700">
                Program
              </label>
              <Input id="program" type="text" {...register("program", { required: "Program is required" })} />
              {errors.program && <p className="mt-1 text-sm text-red-600">{errors.program.message}</p>}
            </div>
            <div>
              <label htmlFor="week" className="block text-sm font-medium text-gray-700">
                Week
              </label>
              <Input id="week" type="number" {...register("week", { required: "Week is required", min: 1 })} />
              {errors.week && <p className="mt-1 text-sm text-red-600">{errors.week.message}</p>}
            </div>
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700">
                Day
              </label>
              <Input id="day" type="number" {...register("day", { required: "Day is required", min: 1, max: 7 })} />
              {errors.day && <p className="mt-1 text-sm text-red-600">{errors.day.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {workoutFields.map((field, workoutIndex) => (
        <Card key={field.id}>
          <CardHeader>
            <CardTitle>Workout Section {workoutIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor={`workout.${workoutIndex}.section`} className="block text-sm font-medium text-gray-700">
                  Section
                </label>
                <Input {...register(`workout.${workoutIndex}.section`, { required: "Section is required" })} />
              </div>
              <div>
                <label htmlFor={`workout.${workoutIndex}.icon`} className="block text-sm font-medium text-gray-700">
                  Icon
                </label>
                <Select
                  onValueChange={(value) => {
                    // @ts-ignore
                    register(`workout.${workoutIndex}.icon`).onChange({
                      target: { value, name: `workout.${workoutIndex}.icon` },
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ideaIcon">Idea Icon</SelectItem>
                    <SelectItem value="weightIcon">Weight Icon</SelectItem>
                    <SelectItem value="runIcon">Run Icon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor={`workout.${workoutIndex}.notes`} className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <Textarea {...register(`workout.${workoutIndex}.notes`)} />
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">Exercises</h4>
                <ul className="space-y-4">
                  {field.exercises.map((exercise, exerciseIndex) => (
                    <li key={exercise.id} className="border p-4 rounded-md">
                      <div className="space-y-2">
                        <Input
                          placeholder="Exercise name"
                          {...register(`workout.${workoutIndex}.exercises.${exerciseIndex}.name`, {
                            required: "Exercise name is required",
                          })}
                        />
                        <Input
                          placeholder="Description"
                          {...register(`workout.${workoutIndex}.exercises.${exerciseIndex}.description`)}
                        />
                        {/* <Input
                          placeholder="Video URL"
                          {...register(`workout.${workoutIndex}.exercises.${exerciseIndex}.video`)}
                        /> */}
                        <select {...register(`workout.${workoutIndex}.video`, { required: "Video is required" })} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          {movements.map((movement, index) => (
                            <option key={index} value={movement.link}>
                              {movement.name}
                            </option>
                          ))}
                        </select>
                        {/* {errors.workouts?.[workoutIndex]?.video && <p className="mt-1 text-sm text-red-600">{errors.workouts[workoutIndex].video.message}</p>} */}
                      </div>
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    const exercises = control._getFieldArray(`workout.${workoutIndex}.exercises`)
                    control._append(`workout.${workoutIndex}.exercises`, { name: "", description: "", video: "" })
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Exercise
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            appendWorkout({ section: "", icon: "", exercises: [{ name: "", description: "", video: "" }] })
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Workout Section
        </Button>
        <Button type="submit">Submit Workout</Button>
      </div>
    </form>
  )
}

