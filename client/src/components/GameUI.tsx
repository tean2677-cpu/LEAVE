import { useBedroomGame } from "@/lib/stores/useBedroomGame";

export function GameUI() {
  const currentView = useBedroomGame((state) => state.currentView);
  const verticalView = useBedroomGame((state) => state.verticalView);
  const hydration = useBedroomGame((state) => state.hydration);
  const fear = useBedroomGame((state) => state.fear);
  const currentTime = useBedroomGame((state) => state.currentTime);
  const teddyBearUses = useBedroomGame((state) => state.teddyBearUses);
  const waterUses = useBedroomGame((state) => state.waterUses);
  const currentNight = useBedroomGame((state) => state.currentNight);
  const isEpilogue = useBedroomGame((state) => state.isEpilogue);
  
  const viewNames = {
    left: "Left Side - Window & Desk",
    center: "Center - TV",
    right: "Right Side - Door"
  };
  
  const bedViewNames = {
    left: "Bed - Left Side (Teddy Bear)",
    center: "Bed - Center (Flashlight)",
    right: "Bed - Right Side (Water)"
  };
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const displayHour = hours === 0 ? 12 : hours;
    return `${displayHour}:${mins.toString().padStart(2, '0')} AM`;
  };
  
  const canUseTeddy = verticalView === 'down' && currentView === 'left' && teddyBearUses > 0;
  const canUseWater = verticalView === 'down' && currentView === 'right' && waterUses > 0;
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 flex gap-4">
        <div className="bg-black/70 text-white p-3 rounded-lg">
          <div className="text-xs mb-1 text-center">Hydration</div>
          <div className="w-8 h-32 bg-gray-700 rounded relative overflow-hidden">
            <div 
              className="absolute bottom-0 w-full bg-cyan-400 transition-all duration-300"
              style={{ height: `${hydration}%` }}
            />
          </div>
          <div className="text-xs mt-1 text-center font-bold">{Math.round(hydration)}</div>
        </div>
        
        <div className="bg-black/70 text-white p-3 rounded-lg">
          <div className="text-xs mb-1">Fear</div>
          <div className="w-32 h-8 bg-gray-700 rounded relative overflow-hidden">
            <div 
              className="absolute left-0 h-full bg-red-500 transition-all duration-300"
              style={{ width: `${fear}%` }}
            />
          </div>
          <div className="text-xs mt-1 text-center font-bold">{Math.round(fear)}</div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 space-y-2">
        <div className="bg-black/70 text-white px-6 py-3 rounded-lg">
          <div className="text-2xl font-bold text-center">{formatTime(currentTime)}</div>
        </div>
        <div className="bg-black/70 text-white px-6 py-3 rounded-lg">
          <div className="text-center">
            <div className="text-xs opacity-70">Day</div>
            <div className="text-2xl font-bold">
              {isEpilogue ? "???" : `Day ${currentNight}`}
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg">
        <div className="text-center">
          <div className="text-sm opacity-70">Current View</div>
          <div className="text-xl font-bold">
            {verticalView === 'standing' ? viewNames[currentView] : bedViewNames[currentView]}
          </div>
          <div className="text-xs opacity-60 mt-1">
            {verticalView === 'standing' ? 'Standing' : 'Looking Down'}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg">
        <div className="text-center space-y-2">
          <div className="text-sm font-semibold">Controls</div>
          <div className="text-xs space-y-1">
            <div><span className="font-bold">A</span> - Look Left</div>
            <div><span className="font-bold">S</span> - Look Center</div>
            <div><span className="font-bold">D</span> - Look Right</div>
            <div><span className="font-bold">W</span> - Look Down</div>
            <div><span className="font-bold">E</span> - Use Item</div>
            <div><span className="font-bold">F</span> - Pick Up Item</div>
          </div>
          
          {verticalView === 'down' && (
            <div className="mt-2 pt-2 border-t border-white/30 text-xs">
              {canUseTeddy && (
                <div className="text-green-400">Press E to use Teddy Bear ({teddyBearUses} left)</div>
              )}
              {canUseWater && (
                <div className="text-blue-400">Press E to drink Water ({waterUses} left)</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
