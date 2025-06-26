import React from 'react'
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUserTasks, deleteTask } from "../../redux/slices/taskSlice";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
const AdminTaskList = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading, error } = useAppSelector((state) => state.tasks);
    const handleDelete = async (task) => {
        const confirm = window.confirm("Are you sure you want to delete this task?");
        if (!confirm) return;

        const result = await dispatch(deleteTask(task._id));

        if (result.meta.requestStatus === "fulfilled") {
            toast.success("Task deleted");
            dispatch(fetchUserTasks()); // Refresh the task list after deletion
        } else {
            toast.error(result.payload);
        }
    };
    useEffect(() => {
        dispatch(fetchUserTasks());
        // console.log(`no of tasks: ${tasks}`);
        console.log('no of tasks admin', tasks);

    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);
    return (
        <div className="flex flex-wrap -mx-3 mb-5">
            <div className="w-full max-w-full px-3 mb-6 mx-auto">
                <div className="relative flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
                    <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
                        <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
                            <h1 className='font-semibold text-2xl'>Assigned Tasks</h1>
              
            </div>

                        <div className="flex-auto block py-8 pt-6 px-9">
                            <div className="overflow-x-auto">
                                <table className="w-full text-dark border-neutral-200 ">
                                    <thead>
                                        <tr className="font-semibold text-secondary-dark text-xl">
                                            <th className="pb-3 text-left">Task title</th>
                                            <th className="pb-3 text-left">Status</th>
                                            <th className="pb-3 text-left">Assigned To</th>
                                            <th className="pb-3 text-left">Due Date</th>
                                            <th className="pb-3 text-center">Update</th>
                                            <th className="pb-3 text-center">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(tasks) && tasks.length === 0 ? (
                                            <tr><td colSpan="6" className="text-center py-4">No tasks assigned</td></tr>
                                        ) : (
                                            Array.isArray(tasks) && tasks.map((task) => (
                                                <tr key={task?._id} className="border-b border-dashed last:border-b-0 hover:bg-gray-50">
                                                    <td className="py-3">{task?.title}</td>
                                                    <td className="py-3 capitalize">{task?.status}</td>
                                                    <td className="py-3">{task?.assignedTo?.name || "N/A"}</td>
                                                    <td className="py-3">{new Date(task?.dueDate).toLocaleDateString("en-GB")}</td>
                                                    <td className="py-3 text-center">
                                                        <Link to={`/tasks/edit/${task?._id}`} className="text-blue-600 hover:underline">Edit</Link>
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <button onClick={() => handleDelete(task)} className="text-red-600 hover:underline">Delete</button>
                                                    </td>
                                                </tr>
                                            )))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminTaskList