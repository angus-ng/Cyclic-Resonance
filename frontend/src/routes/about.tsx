import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
  component: About,
})

function About() {
  return (
    <div className="p-6 max-w-6xl mx-auto bg-background text-text space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-primary mb-6 transform transition-all duration-300 hover:scale-105 hover:text-accent">
          About Cyclic-Resonance
        </h1>
        <p className="text-xl text-text max-w-3xl mx-auto opacity-80 hover:opacity-100 transition-all duration-300">
          Cyclic-Resonance is a tool designed to help players of gacha games
          track and manage their game profiles and in-game resources. It
          centralizes data from multiple gacha games, making it easier for
          players to stay organized and informed about their progress,
          resources, and game events.
        </p>
      </div>

      <div className="bg-background-lighter p-6 rounded-3xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-background text-text">
        <h2 className="text-4xl font-semibold mb-4 text-accent">
          Managing Game Profiles
        </h2>
        <p className="text-lg mb-4">
          With Cyclic-Resonance, you can create and manage detailed profiles for
          each of the gacha games you play. The profile contains key information
          such as:
        </p>
        <ul className="list-disc pl-6 text-lg text-text mb-4">
          <li>In-game Name (IGN)</li>
          <li>Game UID (Unique Identifier)</li>
          <li>Region (for region-based games)</li>
          {/* <li>Creation Date and History of Updates</li> */}
        </ul>
        <p className="text-lg text-text mb-4">
          The app allows you to track these details across multiple games in one
          place, making it easy to manage your game progress and ensure you
          don't miss any important events or milestones.
        </p>
      </div>

      <div className="relative bg-gradient-to-r from-primary via-accent to-secondary p-6 rounded-3xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-opacity-80 text-text">
        <div className="absolute inset-0 bg-black opacity-40 rounded-3xl"></div>

        <h2 className="text-4xl font-semibold mb-4 text-primary relative z-10">
          Resource Tracking
        </h2>
        <p className="text-lg mb-4 relative z-10">
          In gacha games, resources are critical for progressing, making pulls,
          or enhancing your game experience. Cyclic-Resonance includes
          functionality to help you track various resources such as:
        </p>
        <ul className="list-disc pl-6 text-lg mb-4 relative z-10">
          <li>Currency (e.g., Gems, Crystals, Coins)</li>
          <li>Stamina (used for grinding or playing more stages)</li>
          {/* <li>
            Progression Points (e.g., EXP, levels, or other indicators of game
            progression)
          </li> */}
        </ul>
        <p className="text-lg mb-4 relative z-10">
          These resources can be tracked over time,
          {/* allowing you to see how many you have and how they are being spent,  */}
          helping you plan your actions in the game more efficiently.
        </p>
      </div>

      <div className="bg-background-lighter p-6 rounded-3xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-background text-text">
        <h2 className="text-4xl font-semibold mb-4 text-accent">
          Filtering and Sorting
        </h2>
        <p className="text-lg mb-4">
          As your collection of game profiles and resources grows, the app
          provides filtering and sorting options to make it easier to navigate
          your data. Filters can be applied to view resources by type (e.g.,
          Currency, Stamina) or even by specific games. This makes it simpler to
          find the information you're looking for, especially if you have
          multiple profiles across different games.
        </p>
      </div>

      <div className="bg-background-lighter p-6 rounded-3xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-background text-text">
        <h2 className="text-4xl font-semibold mb-4 text-accent">
          Key Features
        </h2>
        <ul className="list-disc pl-6 text-lg mb-4">
          <li>Multiple game profile management with customizable fields</li>
          <li>
            Resource tracking for Currency, Stamina, and other progression
            points
          </li>
          <li>
            Filtering and sorting options for efficient resource and profile
            management
          </li>
          <li>Responsive and user-friendly interface</li>
        </ul>
      </div>

      <div className="relative bg-gradient-to-r from-primary via-accent to-secondary p-6 rounded-3xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-opacity-80 text-text">
        <div className="absolute inset-0 bg-black opacity-40 rounded-3xl"></div>

        <h2 className="text-4xl font-semibold mb-4 text-primary relative z-10">
          Future Plans
        </h2>
        <p className="text-lg mb-4 relative z-10">
          There are plans to expand Cyclic-Resonance with additional features,
          including:
        </p>
        <ul className="list-disc pl-6 text-lg mb-4 relative z-10">
          <li>Support for more gacha games</li>
          <li>Detailed view of each game profile with history and progress</li>
          <li>
            Enhanced analytics for resource usage and progression tracking
          </li>
          <li>Ability to share progress with friends or communities</li>
        </ul>
        <p className="text-lg mb-4 relative z-10">
          As the app evolves, we aim to make it even more powerful for users to
          manage their game profiles and resources seamlessly.
        </p>
      </div>
    </div>
  )
}
