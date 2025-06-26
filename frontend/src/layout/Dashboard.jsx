// import { useSelector, useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { logout, getCurrentUser } from "../redux/slices/authSlice";
// import TaskList from "../pages/tasks/TaskList";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import AdminTaskList from "../pages/tasks/AdminTaskList";

// export default function Dashboard() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (!user) {
//       dispatch(getCurrentUser());
//       navigate('/login')
//     }
//   }, [dispatch, user]);

//   const handleLogout = async () => {
//     await dispatch(logout());
//     toast.success("Logout successful")
//     navigate("/");
//   };
//   console.log(user);

//   return (
//     <div className="flex flex-col h-screen w-screen bg-gray-50 overflow-hidden">
//       {/* Navbar */}
//       <nav className="w-full bg-white shadow px-8 py-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-blue-600">TaskApp</h1>
//         <div className="flex items-center gap-6">
//           {/* <span className="text-black font-medium text-lg">Hi, {user?.name}</span> */}
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 font-semibold mx-auto  text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
//           >
            
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* Main */}
//       <main className="flex-grow px-8 py-6 w-full overflow-auto">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <div>
//             <h2 className="text-4xl font-bold text-blue-700">Dashboard</h2>
//             <p className="text-gray-800 mt-1 text-2xl">
//               Welcome, <span className="font-semibold capitalize">{user?.name}</span>
//             </p>
//           </div>
//           <Link
//             to="/tasks/create"
//             className="bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition"
//           >
//             + Create Task
//           </Link>
//         </div>

//         <div className="h-full">
//           {user.name==="admin"? <AdminTaskList/>: <TaskList/>}
//           {/* <TaskList /> */}
//           {/* <AdminTaskList/> */}
//         </div>
//       </main>
//     </div>

//   );
// }
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout, getCurrentUser } from "../redux/slices/authSlice";
import TaskList from "../pages/tasks/TaskList";
import AdminTaskList from "../pages/tasks/AdminTaskList";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && token) {
      dispatch(getCurrentUser())
        .unwrap()
        .catch(() => {
          navigate("/login");
        });
    } else if (!token) {
      navigate("/login");
    }
  }, [dispatch, user, token, navigate]);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logout successful");
    navigate("/");
  };

  return (
    <div className="flex flex-col ">
      {/* Navbar */}
      <Navbar/>

      {/* Main */}
      <main className="flex-grow px-8 py-6 w-full overflow-auto mt-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-4xl font-bold text-blue-700">Dashboard</h2>
            <p className="text-gray-800 mt-1 text-2xl">
              Welcome, <span className="font-semibold capitalize">{user?.name}</span>
            </p>
          </div>

          {user?.role === "admin" && (
            <Link
  to="/tasks/create"
  className="bg-blue-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow hover:bg-blue-700 transition w-full sm:w-auto text-center"
>
  + Create Task
</Link>
          )}
        </div>

        <div className="h-full">
          {user?.role === "admin" ? <AdminTaskList /> : <TaskList />}
        </div>
      </main>
    </div>
  );
}
