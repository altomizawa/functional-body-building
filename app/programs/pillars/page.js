import Image from 'next/image';
import ideaIcon from '@/public/icons/idea.svg';
import { YouTubeEmbed } from "@next/third-parties/google";
import { verifySession } from '@/lib/session';
import Link from 'next/link';


async function getMovements() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/movements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('No movements found');
      return []; // Return an empty array if no movements found
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    return []; // Return an empty array in case of error
  }
}

async function getWorkout(program, week, day) {
  try {
    const resWorkout = await fetch(`${process.env.BASE_URL}/api/programs/pillars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        program: program,
        week: week,
        day: day,
      }),
    });

    if (!resWorkout.ok) {
      console.error('No workouts found');
      return null; // Return null if no workouts found
    }
    return await resWorkout.json();
  } catch (err) {
    console.error(err);
    return null; // Return null in case of error
  }
}

async function Page({ searchParams }) {
  const session = await verifySession();
  const programList = ['Pillars', 'Cycle 2', 'Cycle 3', 'Cycle 4'];

  const awaitedSearchParams = await searchParams;

  const programIndex = parseInt(awaitedSearchParams.program || 0);
  const week = parseInt(awaitedSearchParams.week || 1);
  const day = parseInt(awaitedSearchParams.day || 1);

  const program = programList[programIndex];
  const movements = await getMovements();
  const workout = await getWorkout(program, week, day);
  console.log(workout._id)

  function createVideoArray(sectionDescription) {
    return movements.filter(movement =>
      sectionDescription.toLowerCase().includes(movement.name.toLowerCase())
    );
  }

  function getQueryValue(url) {
    const parts = url.split('=');
    return parts.length > 1 ? parts[1] : null;
  }

  return (
    <>
      {/* PROFILE DETAILS */}
      <div className="bg-[rgba(0,0,0,0.3)] px-4 py-8 relative overflow-hidden">
          {session.role === 'admin' &&
          <Link href="/programs" className='w-max text-center text-white px-4 py-2 rounded-md duration-300 hover:text-gray-400 flex items-center gap-2 justify-center'>
            <span className="material-symbols-outlined">arrow_back</span>BACK
          </Link>}
        <Image src="/images/Vitinho.jpg" alt="idea icon" width={200} height={200} className="absolute top-[-25%] -z-10 left-0 w-full h-auto" />
        {workout ? (
          <>
            <h1 className="font-bold text-2xl text-white uppercase text-center">{workout.program}</h1>
            <h2 className="font-bold text-lg text-white uppercase text-center">
              Week {workout.week} | day {workout.day}
            </h2>
          </>
        ) : (
          <h1 className="font-bold text-2xl text-white uppercase">No workout found</h1>
        )}
      </div>

      {/* DATE AND PROGRAM SELECTION */}
      <div className="flex justify-center items-center gap-8 py-4 bg-black">
        <a href={`?program=${programIndex - 1}&week=${week}&day=${day}`} className='workout-button'>&lt;</a>
        <p className="uppercase text-white text-xl">{program}</p>
        <a href={`?program=${programIndex + 1}&week=${week}&day=${day}`} className='workout-button'>&gt;</a>
      </div>
      <div className="flex gap-12 justify-center items-center bg-slate-400 py-2">
        <div>
          <div className="flex items-center gap-4 w-max">
            <a href={`?program=${programIndex}&week=${week - 1}&day=1`} className={`${week === 1 ? 'workout-button pointer-events-none opacity-40' : 'workout-button'}`}>&lt;</a>
            <p className="uppercase text-white text-xl">WEEK {week}</p>
            <a href={`?program=${programIndex}&week=${week + 1}&day=1`} className={`${week === 6 ? 'workout-button pointer-events-none opacity-40' : 'workout-button'}`}>&gt;</a>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4 w-max">
            <a href={`?program=${programIndex}&week=${week}&day=${day - 1}`} className={`${day === 1 ? 'workout-button pointer-events-none opacity-40' : 'workout-button'}`}>&lt;</a>
            <p className="uppercase text-white text-xl">DAY {day}</p>
            <a href={`?program=${programIndex}&week=${week}&day=${day + 1}`} className={`${day === 7 ? 'workout-button pointer-events-none opacity-40' : 'workout-button'}`}>&gt;</a>
          </div>
        </div>
      </div>

      {/* WORKOUT */}
      {workout ? (
        <div className="mt-4 mb-12">
          {workout.sections?.map((workoutSection, index) => (
            <div key={index}>
              <div className="w-full bg-black px-4 py-2 mt-8">
                <h3 className="text-white font-bold text-base flex items-center uppercase">
                  <Image src={ideaIcon} alt="icon" width={24} height={24} className="mr-2 upp" />
                  {workoutSection.section}
                </h3>
              </div>

              <div className="w-[90%] mx-auto mt-4 space-y-2">
                <p className="whitespace-pre-line">{workoutSection.description}</p>
              </div>

              {createVideoArray(workoutSection.description).length > 0 && (
                <div className="w-[90%] mx-auto mt-4 space-y-2">
                  <h3>VIDEOS ({createVideoArray(workoutSection.description).length}):</h3>
                  <div className="w-full mx-auto mt-2 space-y-2 flex gap-4 items-center overflow-auto">
                    {createVideoArray(workoutSection.description).map((video, index) => (
                      <div key={index} className="flex flex-col">
                        <p className="text-xs font-bold">{video.name.toUpperCase()}</p>
                        <YouTubeEmbed videoid={getQueryValue(video.link)} width={400} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {workoutSection.notes && (
                <div className="w-[90%] mx-auto mt-4">
                  <h3>NOTES:</h3>
                  <p className="whitespace-pre-line text-sm">{workoutSection.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[80vh]">
          <h1 className="font-bold text-2xl text-black uppercase">No workout found</h1>
        </div>
      )}
    </>
  );
}

export default Page;