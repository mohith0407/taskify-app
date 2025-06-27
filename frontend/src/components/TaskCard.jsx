import { Link } from "react-router-dom";
import { formatDate } from "../helpers/formatDate";
import { useAppDispatch } from "../redux/hooks";
import { toggleTaskStatus, deleteTask } from "../redux/slices/taskSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TaskCard = ({ task }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleToggle = async () => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const result = await dispatch(toggleTaskStatus({ id: task._id, status: newStatus }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(`Marked as ${newStatus}`);
    } else {
      toast.error(result.payload);
    }
  };



  return (
    <div className="flex justify-center md:flex flex-row gap-1 items-center">
      <div className="max-w-sm w-full bg-white px-6 pt-6 pb-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-500">
        {/* Priority */}
        <h3 className="mb-3 text-xl font-bold text-indigo-600">
          Task Priority: <span className="capitalize">{task.priority}</span>
        </h3>

        {/* Due Date */}
        <div className="relative ">
          <p className="absolute top-0  bg-yellow-300 text-gray-800 font-semibold py-1 px-3 rounded-br-lg rounded-tl-lg mb-3">
            Due: {task.dueDate ? formatDate(task.dueDate) : "No due date"}
          </p>
        </div>
        <br />
        {/* Title */}
        <h1 className="mt-6 text-gray-800 text-2xl font-bold">{task.title}</h1>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-4 mb-3 line-clamp-3">
          {task.description}
        </p>
        {/* Info */}
        <div className="mt-4 text-sm font-medium space-y-1">
          <div className="flex items-center gap-2">
            <span>Status: <span className="capitalize">{task.status}</span></span>
          </div>

          {/* <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>
              Assigned To:{" "}
              <span className="font-semibold capitalize">
                {task.assignedTo?.name || "Unassigned"}
              </span>
            </span>
          </div> */}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={handleToggle}
            className={`px-4 py-1 rounded-b-md text-sm font-medium transition ${task.status === "completed"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
          >
            {task.status === "completed" ? "Mark as Pending" : "Mark as Completed"}
          </button>
          {/* View Task Button */}
          <button
            onClick={() => navigate(`/tasks/${task._id}`)}
            className="px-4 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded-b-md font-medium"
          >
            View Details
          </button>

          {/* <Link
            to={`/tasks/edit/${task._id}`}
            className="pt-1 text-blue-600 text-sm hover:underline"
          >
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className="text-red-600 text-sm hover:underline"
          >
            Delete
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
