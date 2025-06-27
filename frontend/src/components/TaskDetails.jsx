import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
    fetchTaskById,
    toggleTaskStatus,
    clearSelectedTask,
} from "../redux/slices/taskSlice";
import { formatDate } from "../helpers/formatDate";
import { toast } from "react-toastify";

const TaskDetails = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate=useNavigate();
    const { selectedTask, loading, error } = useAppSelector((state) => state.tasks);
    const { user } = useAppSelector((state) => state.auth); // assumes user is stored in authSlice

    useEffect(() => {
        dispatch(fetchTaskById(id));
        return () => dispatch(clearSelectedTask());
    }, [dispatch, id]);

    useEffect(() => {
        if (error === "You are not authorized to view this task.") {
            toast.error(error);
        }
    }, [error]);


    if (loading) {
        return <div className="text-center mt-10 text-indigo-600 text-lg animate-pulse">Loading task...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500 font-semibold">{error}</div>;
    }

    if (!selectedTask) return null;

    const { title, description, dueDate, status, priority, assignedTo } = selectedTask;
    const isAllowed = user?.role === "admin" || user?._id === assignedTo?._id;

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-black m-4 border-b pb-2 border-indigo-500 w-fit">
  Task Details
</h1>
        <div className="flex justify-center items-center py-10 px-4 overflow-x-hidden">
            <div className="relative w-full max-w-6xl h-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 transition duration-300 hover:shadow-2xl">

                {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="absolute top-6  left-8 px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          ← Back to Dashboard
        </button>
                
          
                {/* Header */}
                <div className="mb-6 mt-10">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
                    
                </div>

                {/* Task Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</span>
                        <span className="capitalize text-lg font-semibold text-indigo-600">{status}</span>
                    </div>
                    <div className="flex flex-col mt-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Priority</span>
                        <span className="capitalize text-lg font-semibold text-yellow-600">{priority}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Due Date</span>
                        <span className="text-lg font-semibold text-red-500">
                            {dueDate ? formatDate(dueDate) : "N/A"}
                        </span>
                    </div>
                    <div className="flex flex-col mt-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{assignedTo?.email}</span>
                    </div>
                </div>

                {/* Description */}
                <div>
  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Description</span>
  <p className="mt-2 text-gray-800 dark:text-gray-200 text-sm leading-relaxed border border-gray-200 dark:border-gray-700 p-4 rounded-xl bg-white dark:bg-gray-800 h-48 overflow-y-auto whitespace-pre-line">
    {description}
  </p>
</div>
            </div>
        </div>
        </div>
    );
};

export default TaskDetails;
