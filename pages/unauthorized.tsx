import React from "react";
import Link from "next/link";

const RickRollPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white text-center flex-col p-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Never Gonna Give You Up 🎵
      </h1>
      <p className="text-lg md:text-2xl mb-6">
        Looks like you&apos;ve stumbled upon a restricted area. Here&apos;s a little treat for you!
      </p>
      <img
        src="/rickroll.gif"
        alt="Rick Roll"
        className="w-3/4 max-w-lg rounded-lg shadow-lg"
      />
      <Link href="/">
        <button className="mt-8 px-6 py-3 bg-baseColor text-white rounded-lg hover:bg-hoverColor">
          Go Back to Safety 🏠
        </button>
      </Link>
    </div>
  );
};

export default RickRollPage;
