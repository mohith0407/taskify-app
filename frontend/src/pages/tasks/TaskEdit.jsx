import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PRIORITY_LEVELS } from "../../constants/priorityLevels";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateTask } from "../../redux/slices/taskSlice";
import { toast } from "react-toastify";
import axios from "../../api/axiosInstance";

const TaskEdit = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "low",
  });

  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/tasks/${id}`);
        const task = res.data.task;
        setFormData({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate?.slice(0, 10),
          priority: task.priority,
        });
      } catch (err) {
        toast.error("Failed to load task");
      } finally {
        setFetching(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateTask({ id, updatedData: formData }));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Task updated successfully");
      navigate("/dashboard");
    } else {
      toast.error(result.payload);
    }
  };

  if (fetching) return <p className="text-center mt-10">Loading task...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-xl font-bold mb-4">Edit Task</h2>
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
        >
          {PRIORITY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskEdit;
