import React from 'react'

function App() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🎉 Sistema Funcionando!</h1>
      <p>Se você está vendo esta mensagem, o React está funcionando perfeitamente!</p>
      <div style={{ marginTop: '2rem' }}>
        <button 
          style={{ 
            padding: '1rem 2rem', 
            fontSize: '1.2rem', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          onClick={() => alert('Botão funcionando! 🎯')}
        >
          Testar Botão
        </button>
      </div>
    </div>
  )
}

export default App
