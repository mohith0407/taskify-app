import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRIORITY_LEVELS } from "../../constants/priorityLevels";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createTask, fetchUserTasks } from "../../redux/slices/taskSlice";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance"; // Axios instance with auth token

const TaskCreate = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.tasks);

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
    assignedTo: "",
  });

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users"); // Must be protected route
        setUsers(res.data);
      } catch (err) {
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createTask({ ...formData, priority: formData.priority.toLowerCase() })
    );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Task created successfully");
      dispatch(fetchUserTasks());
      navigate("/dashboard");
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8 text-black">
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows="4"
          required
        ></textarea>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          {PRIORITY_LEVELS.map((level) => (
            <option key={level} value={level.toLowerCase()}>
              {level}
            </option>
          ))}
        </select>

        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Assign To</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskCreate;
