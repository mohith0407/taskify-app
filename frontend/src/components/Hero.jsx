import { Link } from "react-router-dom";
import Register from "../pages/auth/Register";

const Hero = () => {
  return (
    <div className="flex items-center justify-center">
    <section className="flex flex-wrap justify-center items-center font-sans px-4 mx-auto w-full lg:max-w-screen-lg sm:max-w-screen-sm md:max-w-screen-md pb-20 pt-32">
      {/* Column-1 */}
      <div className="px-3 w-1/2 lg:w-2/5">
        <div className="mx-auto mb-8 max-w-lg text-center lg:mx-0 lg:max-w-md lg:text-left">
          <h2 className="mb-4 text-3xl font-bold text-left lg:text-5xl">
            Modern Teams and{" "}
            <span className="text-5xl text-blue-500 leading-relaxed">
              Technology
            </span>{" "}
            Streamline Your Workflow
          </h2>
          <p className="mx-0 mt-3 mb-0 text-sm leading-relaxed text-left text-slate-400">
            Organize, assign, and track tasks efficiently to boost team productivity and meet deadlines with ease.
          </p>
        </div>

        <div className="text-center lg:text-left">
          <Link to="/login" className="block py-4 px-8 mb-4 text-md font-semibold tracking-wide leading-none text-white bg-blue-500 rounded cursor-pointer sm:mr-3 sm:mb-0 sm:inline-block">
            Login
          </Link>
          <Link to="/register" className="block py-4 px-8 text-md font-semibold leading-none bg-white rounded border border-slate-200 text-slate-500 hover:bg-blue-500 hover:text-white cursor-pointer sm:inline-block transition-all duration-300 ease-in-out">
  Register
</Link>
        </div>
      </div>
      {/* <Register/> */}
    </section>
    </div>
  );
};

export default Hero;
