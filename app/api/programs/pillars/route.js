import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';

import Workout from '@/app/models/workout';
import Pillar from '@/app/models/pillar';

export async function POST(req) {
  const body = await req.json();
  console.log('this is the body: ', body)
  await connectDB();
  try {
    const dailyWorkout = await Pillar.findOne({week: body.week, day: body.day});
    // console.log('this is the daily workout: ', dailyWorkout)
    return NextResponse.json(dailyWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

export async function PATCH(req, res) {
  const body = await req.json();
  console.log('this is the body: ', body)
  
  await connectDB();
  try {
    const dailyWorkout = await Pillar.findOne({date: new Date("2012-01-26")});
    return NextResponse.json(dailyWorkout);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

export async function GET(req) {

console.log(req.url)
console.log('get')
  await connectDB();
  try {
    const workouts = await Pillar.find();
    // console.log('this is the daily workout: ', dailyWorkout)
    return NextResponse.json(workouts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
  }
}

// export async function POST (req, res) {
//   await connectDB();
//   const {method} = req;
//   const body = {
//     date: new Date("2025-01-25"),
//     program: "January Cycle | Pillars",
//     week: 1,
//     day: 1,
//     workout: [
//       {
//         section: "Coach Note",
//         icon: "ideaIcon",
//         exercises: [
//           {
//             name: "",
//             description:
//               "Today, the TEMPO bench press is decreasing in reps to allow for an increase in weight. This should be a very small increase in weight because each set has only been reduced by one rep. The progression may also be small in the other training sections, meaning the weight will change only slightly. We are constantly looking for ways to progressively overload in training. Still, for upper body or more isolated muscle exercises, this may happen throughout an entire training block, not over a couple of weeks. Be patient with your progress, and focus on the stimulus you are getting in each individual set - that will be the best way to assure progress."
//           }
//         ]
//       },      
//       {
//         section: "Short on Time",
//         icon: "ideaIcon",
//         exercises: [
//           {
//             description: "Skip the Hot Start or Conditioning section today."
//           }
//         ]
//       },
//       {
//         section: "Warm Up (8-10 min)",
//         icon: "ideaIcon",
//         exercises: [
//           { name: "3 Rounds", description: " ", video: "" },
//           { name: "Cardio of choice", description: "90 sec", video: "" },
//           {
//             name: "Banded Face Pull",
//             description: "15-20 reps",
//             video: "https://www.youtube.com/watch?v=5jgKj8ColLg"
//           },
//           {
//             name: "Yoga Push Ups",
//             description: "1-10 reps",
//             video: "https://www.youtube.com/watch?v=_AOxb-7uwEE"
//           }
//         ]
//       },
//       {
//         section: "Hot Start (10-12 min)",
//         icon: "ideaIcon",
//         exercises: [
//           { name: "5 Rounds", description: " ", video: "" },
//           { name: "Supinated Strict Pull Ups", description: "4 reps", video: "" },
//           {
//             name: "Yoga Push Ups",
//             description: "8 reps",
//             video: "https://www.youtube.com/watch?v=5jgKj8ColLg"
//           },
//           {
//             name: "Row",
//             description: "15/12 calories",
//             video: "https://www.youtube.com/watch?v=_AOxb-7uwEE"
//           }
//         ],
//         notes: " "
//       },
//       {
//         section: "Strength Intensity (12 min)",
//         icon: "ideaIcon",
//         exercises: [
//           { name: "EVERY 2:30 X 4 WORKING SETS", description: " ", video: "" },
//           { name: "SET 1: Barbell Bench Press", description: "7 reps | RPE 8 | @22X1", video: "" },
//           { name: "SET 2: Barbell Bench Press", description: "7 reps | RPE 8 | @22X1", video: "" },
//           { name: "SET 3: Barbell Bench Press", description: "7 reps | RPE 8 | @22X1", video: "" },
//           { name: "SET 4: Barbell Bench Press", description: "7 reps | RPE 8 | @22X1", video: "" }
//         ],
//         notes: "RPE 8: 2 reps in the tank. @22X1: 2 sec down, 2 sec pause at bottom, explode up, 1 sec pause at top."
//       },
//       {
//         section: "Strength Balance (14 min)",
//         icon: "ideaIcon",
//         exercises: [
//           { name: "3 SETS", description: " ", video: "" },
//           { name: "Dumbell Skull Crushers", description: "8-10 reps | @31X1 - rest 30 sec", video: "" },
//           { name: "Straddle Plate Front Raise", description: "10-15 reps | @20X0 - rest 60-90 sec", video: "" }
//         ],
//         notes: "Loading Note: Perform a few reps of each movement to determine the starting weight. Aim for each set to be close to form failure within the rep range. Progression Note: Aim to increase total reps from week 2."
//       },
//       {
//         section: "Conditioning (15 - 18min)",
//         icon: "ideaIcon",
//         exercises: [
//           { name: "FOR TIME", description: " ", video: "" },
//           { name: "Single Arm Dumbbell Push Press", description: "right | 8 reps (50/35)", video: "" },
//           { name: "Alternating Single Leg Toes to Bar", description: "4 reps/side", video: "https://www.youtube.com/watch?v=Yk47QqV2g_c" },
//           { name: "Single Arm Dumbbell Push Press", description: "left | 8 reps (50/35)", video: "" },
//           { name: "Alternating Single Leg Toes to Bar", description: "4 reps/side", video: "https://www.youtube.com/watch?v=Yk47QqV2g_c" },
//           { name: "+", description: " ", video: "" },
//           { name: "20-15-10", description: " ", video: "" },
//           { name: "Ring Push Ups", description: " ", video: "https://www.youtube.com/watch?v=PD-PoTGKKpE" },
//           { name: "Tuck Ups", description: " ", video: "https://www.youtube.com/watch?v=vb6DC9_NDcE" },
//           { name: "+ Row", description: "500/400m", video: "https://www.youtube.com/watch?v=gON7XC5WxCM" }
//         ],
//         notes: "Start on the row with a sustainable but challenging pace. Select a weight that you can perform all DB Push Press unbroken. Break up the reps as necessary to keep up a good pace. If you paced correctly, you should be able to match or even beat your pace on the second row."
//       },
//       {
//         section: "Cooldown (5 min)",
//         icon: "ideaIcon",
//         exercises: [
//           { name: "Supinated Passive Hang", description: "30 sec", video: "https://www.youtube.com/watch?v=Xz9R2YSJbL8" },
//           { name: "Banded Shoulder Extension Stretch", description: "60 sec", video: "https://www.youtube.com/watch?v=NYxPyPOBt78" },
//           { name: "Single Arm Wall Prayer Stretch", description: "30 sec/side", video: "https://www.youtube.com/watch?v=IXnOMg4sT9U" }
//         ],
//         notes: " "
//       }
//     ]
//   }

//     // ]
//   console.log('this is the body: ', body, 'this is the method: ', method)
//   try {
//     if (method === 'POST') {
//       const newWorkout = new Workout(body)
//       const addedWorkout = await Workout.create(newWorkout);
//       return NextResponse.json(addedWorkout);
//     }
//     const dailyWorkout = await Workout.findOne();
//     return NextResponse.json(dailyWorkout);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
//   }
// }


