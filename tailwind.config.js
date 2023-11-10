/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          GeoPurple : "#9370DB",
          GeoBackGround: "#5928E5",
          GeoOrange: "#F5B651",
          GeoBlue : "#70E2D9"
        }
      },
      fontFamily: {
        'PyeongChangPeace-Light': ['PyeongChangPeace-Light', 'sans'],
        'PyeongChangPeace-Bold': ['PyeongChangPeace-Bold', 'sans'],
        'NanumSquareNeoOTF-Bd': ['NanumSquareNeoOTF-Bd', 'sans'],
        'NanumSquareNeoOTF-Lt': ['NanumSquareNeoOTF-Lt', 'sans'],
      }
    }
    ,
  },
  plugins: ['prettier-plugin-tailwindcss'],
}

{/* <div className="flex items-center">
<input
    className="text-2xl font-PyeongChangPeace-Light rounded-md border-solid border-2 border-gray-300 "
    placeholder="Search for maps"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyUp={handleSearch}
></input>
<button
    className = "text-2xl font-PyeongChangPeace-Bold rounded-md ml-10 px-8 border-solid border-2 border-gray-300 hover:bg-gray-300 text-gray-600"
> Search </button>
</div> */}
