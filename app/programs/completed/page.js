'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getQueryValue, createVideoArray } from '@/utils/utils';
import { YouTubeEmbed } from "@next/third-parties/google";
import ideaIcon from '@/public/icons/idea.svg';
import { getAllMovements } from '@/lib/actions';

function CompletedWorkoutsPage() {
  const [user, setUser] = useState(null);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch user session
  async function fetchUserSession() {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        return data.user;
      } else {
        console.error('Session error:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }

  // Fetch completed workouts with details
  async function fetchCompletedWorkouts(userId) {
    try {
      const response = await fetch(`/api/workouts/completed?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setCompletedWorkouts(data.completedWorkouts);
        setFilteredWorkouts(data.completedWorkouts);
        setTotalPages(Math.ceil(data.completedWorkouts.length / itemsPerPage));
        return data.completedWorkouts;
      } else {
        console.error('Error fetching completed workouts:', data.error);
        return [];
      }
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Fetch all movements for video display
  async function getMovements() {
    if (movements.length > 0) {
      return movements; // Use cached movements if available
    }
    try {
      const fetchedMovements = await getAllMovements();
      setMovements(fetchedMovements.data);
      return fetchedMovements.data;
    } catch (err) {
      console.error(err);
      return []; // Return an empty array in case of error
    }
  }

  // Toggle workout expansion
  const toggleWorkoutExpansion = (workoutId) => {
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null);
    } else {
      setExpandedWorkout(workoutId);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredWorkouts(completedWorkouts);
      setTotalPages(Math.ceil(completedWorkouts.length / itemsPerPage));
      setCurrentPage(1); // Reset to first page when clearing search
      return;
    }

    // Filter workouts based on exercise names in the descriptions
    const filtered = completedWorkouts.filter(workout => {
      // Check if any section contains the search term
      return workout.sections.some(section => {
        const description = section.description.toLowerCase();
        return description.includes(term);
      });
    });
    
    setFilteredWorkouts(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setTotalPages(Math.ceil(filteredWorkouts.length / newItemsPerPage));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredWorkouts.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      const userData = await fetchUserSession();
      if (userData?._id) {
        await Promise.all([
          fetchCompletedWorkouts(userData._id),
          getMovements()
        ]);
      }
      setLoading(false);
    };

    initPage();
  }, []);

  // Update total pages when filtered workouts or items per page changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredWorkouts.length / itemsPerPage));
  }, [filteredWorkouts, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[rgba(0,0,0,0.3)] px-4 py-8 relative overflow-hidden mb-6">
        <Link href="/programs" className='w-max text-center text-white px-4 py-2 rounded-md duration-300 hover:text-gray-400 flex items-center gap-2 justify-center'>
          <span className="material-symbols-outlined">arrow_back</span>BACK
        </Link>
        <Image src="/images/Vitinho.jpg" alt="background" width={200} height={200} className="absolute top-[-25%] -z-10 left-0 w-full h-auto" />
        <h1 className="font-bold text-2xl text-white uppercase text-center">Completed Workouts</h1>
      </div>

      {/* Search and Pagination Controls */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search for exercises..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <label htmlFor="itemsPerPage" className="text-sm font-medium">Show:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm">per page</span>
          </div>
          
          <div className="text-sm">
            Showing {filteredWorkouts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredWorkouts.length)} of {filteredWorkouts.length} workouts
          </div>
        </div>
      </div>

      {/* Completed Workouts List */}
      {filteredWorkouts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No completed workouts found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {getCurrentPageItems().map((workout) => (
            <div key={workout._id} className="border border-gray-200 rounded-md overflow-hidden">
              {/* Workout Header - Always visible */}
              <div 
                className="bg-black px-4 py-3 flex justify-between items-center cursor-pointer"
                onClick={() => toggleWorkoutExpansion(workout._id)}
              >
                <div className="text-white">
                  <h2 className="font-bold text-lg uppercase">{workout.program}</h2>
                  <p className="text-sm">Week {workout.week} | Day {workout.day}</p>
                  <p className="text-xs text-gray-400">
                    Completed on: {new Date(workout.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="material-symbols-outlined text-white">
                  {expandedWorkout === workout._id ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {/* Expanded Workout Details */}
              {expandedWorkout === workout._id && (
                <div className="p-4 bg-white">
                  {workout.sections?.map((section, index) => (
                    <div key={index} className="mb-6">
                      <div className="w-full bg-slate-800 px-4 py-2 mb-3">
                        <h3 className="text-white font-bold text-base flex items-center uppercase">
                          <Image src={ideaIcon} alt="icon" width={24} height={24} className="mr-2" />
                          {section.section}
                        </h3>
                      </div>

                      <div className="w-full mx-auto space-y-2">
                        <p className="whitespace-pre-line">{section.description}</p>
                      </div>
                      
                      {section.notes && (
                        <div className="w-full mx-auto mt-4">
                          <h3>NOTES:</h3>
                          <p className="whitespace-pre-line text-sm">{section.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              First
            </button>
            
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              &lt;
            </button>
            
            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show current page, 2 pages before and after when possible
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
              // Show ellipsis for skipped pages
              if (
                (pageNumber === currentPage - 3 && pageNumber > 1) ||
                (pageNumber === currentPage + 3 && pageNumber < totalPages)
              ) {
                return <span key={pageNumber} className="px-2">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              &gt;
            </button>
            
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Last
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

export default CompletedWorkoutsPage;
