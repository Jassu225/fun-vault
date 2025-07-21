export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-gray text-cyber-purple font-mono">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(179,179,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(179,179,255,0.03)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none -z-10"></div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-blue bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-shift text-glow mb-8">
            FUN-VAULT
          </h1>
          
          <p className="text-xl text-cyber-blue uppercase tracking-widest mb-12">
            Digital Arcade • AI Opponents • Classic Strategy
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-cyber-gray/50 backdrop-blur-sm border border-cyber-blue/20 rounded-lg p-6 hover:border-cyber-blue/40 transition-all duration-300">
              <h3 className="text-2xl font-bold text-cyber-blue mb-4">Tic-Tac-Toe</h3>
              <p className="text-cyber-purple/80 mb-4">Classic 3x3 grid strategy with AI opponents</p>
              <button className="bg-gradient-to-r from-cyber-blue to-cyber-purple text-white px-6 py-2 rounded hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300">
                Play Now
              </button>
            </div>
            
            <div className="bg-cyber-gray/50 backdrop-blur-sm border border-cyber-blue/20 rounded-lg p-6 hover:border-cyber-blue/40 transition-all duration-300">
              <h3 className="text-2xl font-bold text-cyber-blue mb-4">Connect Four</h3>
              <p className="text-cyber-purple/80 mb-4">Drop tokens to create winning combinations</p>
              <button className="bg-gradient-to-r from-cyber-blue to-cyber-purple text-white px-6 py-2 rounded hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300">
                Play Now
              </button>
            </div>
            
            <div className="bg-cyber-gray/50 backdrop-blur-sm border border-cyber-blue/20 rounded-lg p-6 hover:border-cyber-blue/40 transition-all duration-300">
              <h3 className="text-2xl font-bold text-cyber-blue mb-4">Checkers</h3>
              <p className="text-cyber-purple/80 mb-4">Strategic piece movement and captures</p>
              <button className="bg-gradient-to-r from-cyber-blue to-cyber-purple text-white px-6 py-2 rounded hover:shadow-lg hover:shadow-cyber-blue/25 transition-all duration-300">
                Play Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 