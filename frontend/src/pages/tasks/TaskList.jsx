import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUserTasks } from "../../redux/slices/taskSlice";
import TaskCard from "../../components/TaskCard";
import { toast } from "react-toastify";

const TaskList = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchUserTasks());
    // console.log(`no of tasks: ${tasks}`);
    
  }, [dispatch]);
  
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);
  console.log('no of tasks', tasks);
  // console.log(tasks);

  return (
    <div className="py-6  mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">My Tasks</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="grid gap-3 grid-cols-3 text-black">
          {/* console.log(tasks); */}
          
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task._id} task={task} />)
          ) : (
            <p>No tasks available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
